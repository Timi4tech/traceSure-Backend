import { z } from 'zod';

export const createUserSchema = z.object({
  
    email: z.string().email(),
    name: z.string().min(1),
    password:z.string().min(8),
    removeOnComplete: z.string().int().positive().default(1000), 
    removeOnFail: z.string().int().positive().default(5000)
  
});

export const zodErrorTree =  async(error)=>{
  const newError =  z.treeifyError(error)
    return newError
}