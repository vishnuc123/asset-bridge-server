import mongoose, { Schema, type Document } from "mongoose";
import type { Ikyc } from "../../../core/models/kyc-model";
import { required } from "zod/mini";

export interface IKycDocument extends Ikyc, Document { }

const KycSchema = new Schema<IKycDocument>(
    {
        userid: {
            type: String,
            required: true,
            trim: true,
            unique:true,
            index:true
        },
        overallStatus: {
            type: String,
            required: true,
            enum: ["pending", "verified", "rejected"],
            default: "pending",
        },
        documents: [
            {
                type: {
                    type: String,
                    required: true,
                    enum: ["passport", "adhaar", "selfie"]
                },
                storedPath: {
                    type: String,
                    required: true,
                    trim: true
                },
                verifiedAt: {
                    type: Date,
                    default: null,
                },

                verifiedBy: {
                    type: String,
                    default: null,
                },

                rejectionReason: {
                    type: String,
                    default: null,
                    trim: true,
                },
                documentStatus: {
                    type: String,
                    required: true,
                    enum: ["pending", "Verified", "rejected"],
                    default: "pending"
                }
            }
        ]

    },
    {
        timestamps: true
    }
)

export const KycModel = mongoose.model<IKycDocument>("Kyc-documents",KycSchema)