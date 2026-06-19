// pages/api/processTelemetry.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { callAIBackend } from '../../lib/llmClient';
import { getTransitDistance } from '../../lib/googleMapsClient';

import { adminAuth } from '../../lib/firebaseAdmin';

/**
 * Expected request body (JSON)
 * {
 *   telemetry: Record<string, any>  // raw user telemetry (e.g., transit, food, energy)
 * }
 */
interface TelemetryPayload {
  telemetry: Record<string, any>;
}

/**
 * JSON schema returned to the frontend
 */
interface CarbonSenseResponse {
  telemetry_processed: true;
  metrics: {
    daily_co2e_kg: number;
    weekly_trajectory: string;
  };
  webgl_parameters: {
    environment_state_vector: number; // 0.0 – 1.0
    suggested_lighting_hex: string; // e.g., "#A3E4D7"
    particle_density: number; // integer
  };
  user_delivery: {
    acknowledgment: string;
    micro_frictionless_action: string;
  };
}

/**
 * Helper to validate incoming payload
 */
function validatePayload(body: any): body is TelemetryPayload {
  return typeof body === 'object' && body !== null && 'telemetry' in body && typeof body.telemetry === 'object';
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed – use POST' });
  }

  // --- FIREBASE AUTH VERIFICATION ---
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized – Missing Bearer Token' });
  }

  const token = authHeader.split('Bearer ')[1];
  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch (error) {
    console.error("Token verification failed:", error);
    return res.status(401).json({ error: 'Unauthorized – Invalid Token' });
  }
  // ----------------------------------

  // Parse and validate request body
  const payload = req.body;
  if (!validatePayload(payload)) {
    return res.status(400).json({ error: 'Invalid payload – must contain a "telemetry" object' });
  }

  try {
    // Integrate Google Maps API to enrich telemetry with real transit distance
    if (payload.telemetry.transit?.origin && payload.telemetry.transit?.destination) {
      const realKm = await getTransitDistance(
        payload.telemetry.transit.origin,
        payload.telemetry.transit.destination,
        payload.telemetry.transit.mode || 'transit'
      );
      payload.telemetry.transit.km = Number(realKm.toFixed(2));
      
      // Clean up the payload so the LLM just gets the numbers
      delete payload.telemetry.transit.origin;
      delete payload.telemetry.transit.destination;
    }

    // Send enriched telemetry to the Google Gemini API and expect a strict JSON response
    const llmResponse = await callAIBackend(payload.telemetry);

    // Defensive: ensure we received an object that matches our schema (runtime check)
    const requiredKeys = [
      'telemetry_processed',
      'metrics',
      'webgl_parameters',
      'user_delivery',
    ];

    const missing = requiredKeys.filter((k) => !(k in llmResponse));
    if (missing.length) {
      throw new Error(`LLM response missing keys: ${missing.join(', ')}`);
    }

    // Cast to our interface – we trust the LLM to obey the schema
    const responseData = llmResponse as CarbonSenseResponse;
    return res.status(200).json(responseData);
  } catch (err: any) {
    console.error('Error processing telemetry:', err);
    return res.status(500).json({ error: err.message ?? 'Internal Server Error' });
  }
}
