import { Request, Response, NextFunction } from 'express';
import axios, { AxiosResponse } from 'axios';
import * as dotenv from 'dotenv';

import { validationResult } from 'express-validator';

dotenv.config()

const apiInstance = axios.create({
    headers: {
      'x-api-key' : process.env.API_KEY
      }
    }
  );

interface Position {
    x: number;
    y: number;
    z: number;
}


// getting all posts
const getShortestPath = async (req: Request, res: Response, next: NextFunction) => {

    const err = validationResult(req);

    if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array() });
    }
    const products: string[] = req.body.products;
    const startingPos: Position = req.body.start;

    let productPositions:any = {}
    // get positions for all products
    for (let prod of products) {
        productPositions[prod] = await getPositions(prod);
    }

    let result = naiveSearch(productPositions, startingPos)
    return res.status(200).json(result);
};

function productURL(productId: string): string {
    return `https://dev.aux.boxpi.com/case-study/products/${productId}/positions`;
}

async function getPositions(productId: string): Promise<any> {
    let result: AxiosResponse = await apiInstance.get(productURL(productId));
    return result.data;
}

function naiveSearch(productObjects: any, start: any): any{
    
    let startPos = start;
    let finalPositions = [];
    let totalDistance = 0;

    while (!!Object.keys(productObjects).length) {

        let shortestDist = Number.MAX_SAFE_INTEGER;
        let nearestProd;

        for (let product in productObjects) {
            console.log("checking product", product);
            for (let position of productObjects[product]) {

                let pos = {x: position.x, y: position.y, z: position.z};

                if (calculateDistance(pos, startPos ) < shortestDist) {
                    shortestDist = calculateDistance(pos, startPos);
                    nearestProd = position;
                }
            }
        }
        totalDistance += shortestDist;
        startPos = {x: nearestProd.x, y: nearestProd.y, z: nearestProd.z};
        finalPositions.push(nearestProd);
        delete productObjects[nearestProd.productId];
    }

    // console.log('final positions =>', finalPositions, totalDistance);
    return {
        pickingOrder: finalPositions.map(pos => 
            ({
                productId: pos.productId, 
                positionId: pos.positionId
            })),
        distance: Math.round(totalDistance)
    }
}

function calculateDistance(start: Position, end: Position): number{
    let a: number = end.x - start.x;
    let b: number = end.y - start.y;
    let c: number = end.z - start.z;

    return Math.sqrt(a * a + b * b + c * c);
}

export default {getShortestPath}