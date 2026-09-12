"use server";

import {
  createContactLead,
  createTradeLead,
  createInterestLead,
  type LeadResult,
} from "@/lib/leads";

/**
 * Server Actions dos formulários. Rodam só no servidor; o client chama por RPC.
 * Toda validação e escrita acontece em src/lib/leads.ts.
 */

export async function submitContactLead(data: unknown): Promise<LeadResult> {
  return createContactLead(data);
}

export async function submitTradeLead(data: unknown): Promise<LeadResult> {
  return createTradeLead(data);
}

export async function submitInterestLead(data: unknown): Promise<LeadResult> {
  return createInterestLead(data);
}
