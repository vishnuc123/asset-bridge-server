import { createClient } from "@supabase/supabase-js";
import { env } from "../../../shared/constants/env";
import { AppError } from "../../../shared/utils/AppError";
import { HttpStatusCode } from "../../../shared/constants/HttpStatusCodes";

const supabaseUrl = env.SUPABASE_URL
const supabaseSecreat = env.SUPABASE_SECRET_KEY;
if (!supabaseUrl || !supabaseSecreat) {
    throw new AppError("missing env supabase url or secreat", HttpStatusCode.NOT_FOUND)
}

export const supabase = createClient(supabaseUrl, supabaseSecreat)
export const KYC_BUCKET = env.SUPABASE_KYC_BUCKET ?? "file_uploads";