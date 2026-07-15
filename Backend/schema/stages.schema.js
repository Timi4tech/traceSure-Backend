import { z } from 'zod';

export const createStageSchema = z.object({
    name:z.strin(),
    stages:z.string(),
    productId: z.string(),
    stageName: z.string(),
    data:z.string(),
    registrationNumber:z.string(),
    removeOnComplete: z.string().int().positive().default(1000), 
    removeOnFail: z.string().int().positive().default(5000)

});

export const zodErrorTree =  async(error)=>{
  const newError =  z.treeifyError(error)
    return newError
}