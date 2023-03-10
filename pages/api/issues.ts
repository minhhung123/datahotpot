import {prisma} from '../../lib/prismadb';
import {getSession} from 'next-auth/react';


export default async function handler(
    req: any,
    res: any
) {
    if (req.method === 'POST') {
        try {
            const {title, requirements, criteria, tags} = req.body;
            const categories = tags.map((tag: any) => {
                return {name: tag.label}
            });
            const session = await getSession({req});
            if (!session) {
                res.status(401).json({message: 'Unauthorized'});
                return;
            }
            const authorId = session.user.uid;
            
            const result = await prisma.issue.create({
                data: {
                    title,
                    requirements,
                    criteria,
                    author: { connect: { id: authorId } },
                    categories: {
                        connectOrCreate: categories.map((category: any) => ({
                            where: {name: category.name},
                            create: {name: category.name}
                        }))
                    },  
                }
                
            });
            console.log(result);
            res.status(200).json(result);
        }
        catch (e) {
            console.log(e);
            res.status(500).json({ message: 'Something went wrong' });
        }
    }

    else {
		res.setHeader('Allow', ['POST'])
		res
			.status(405)
			.json({ message: `HTTP method ${req.method} is not supported.` })
	}
    
}