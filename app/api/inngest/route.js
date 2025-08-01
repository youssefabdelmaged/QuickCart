import { serve } from "inngest/next";
import {
  inngest,
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdate,
  orderCreation,
} from "@/config/inngest";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCreation,
    syncUserUpdate,
    syncUserDeletion,
    orderCreation,
  ],
});
