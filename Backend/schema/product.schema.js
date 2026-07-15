import { z } from 'zod';

export const createProductSchema = z.object({
  
    tempplateId: z.string(),
    name: z.string(),
    batchNumber:z.string(),
    registrationNumber:z.string(),
    removeOnComplete: z.string().int().positive().default(1000), 
    removeOnFail: z.string().int().positive().default(5000)

});

export const zodErrorTree =  async(error)=>{
  const newError =  z.treeifyError(error)
    return newError
}