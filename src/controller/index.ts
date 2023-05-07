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

interface Coordinates {
    x: number;
    y: number;
    z: number;
}

/**
 * Function to handle getPath route logic, validates input in req body and 
 * returns json response
 * @param req 
 * @param res 
 * @param next 
 * @returns json response
 */
const getShortestPath = async (req: Request, res: Response, next: NextFunction) => {

    const err = validationResult(req);
    // check validation results 
    if (!err.isEmpty()) {
        return res.status(400).json({ errors: err.array() });
    }
    const products: string[] = req.body.products;
    const startingPos: Coordinates = req.body.start;
    let productPositions: any = {}
    // get positions for all products with key and array of positions for each productId
    for (let prod of products) {
        productPositions[prod] = await getPositions(prod);
    }

    // perform nearest neighbour search from start till last product
    let result = naiveSearch(productPositions, startingPos);
    return res.status(200).json(result);
};

function productURL(productId: string): string {
    return `https://dev.aux.boxpi.com/case-study/products/${productId}/positions`;
}

async function getPositions(productId: string): Promise<any> {
    let result: AxiosResponse = await apiInstance.get(productURL(productId));
    return result.data;
}
/**
 * Function takes
 * @param productObjects 
 * @param start 
 * @returns 
 */
function naiveSearch(productObjects: any, start: any): any{
    
    let startPos = start;
    let finalPositions = [];
    let totalDistance = 0;
    // untill we check every productID, we are removing them from productObjects
    while (!!Object.keys(productObjects).length) {

        let shortestDist = Number.MAX_SAFE_INTEGER;
        let nearestProd;
        
        for (let product in productObjects) {
            // for each productID we go through list of positions
            for (let position of productObjects[product]) {
                // we compare distance to each position and find shortest one
                let pos = {x: position.x, y: position.y, z: position.z};
                // can choose also function euclidian distance for 3D distance
                if (manhattanDistance(pos, startPos ) < shortestDist) {
                    shortestDist = manhattanDistance(pos, startPos);
                    nearestProd = position;
                }
            }
        }
        totalDistance += shortestDist;
        // we switch startPos to nearest product and repeat untill we get every ID
        startPos = {x: nearestProd.x, y: nearestProd.y, z: nearestProd.z};
        finalPositions.push(nearestProd);
        delete productObjects[nearestProd.productId];
    }

    // in the end we adjust response object to the way it should be
    return {
        pickingOrder: finalPositions.map(pos => 
            ({
                productId: pos.productId, 
                positionId: pos.positionId
            })),
        distance: Math.round(totalDistance)
    }
}

// this is euclidiant distance, which has diagonals, not suitable for real world
function euclidianDistance(start: Coordinates, end: Coordinates): number{
    let a: number = end.x - start.x;
    let b: number = end.y - start.y;
    let c: number = end.z - start.z;

    return Math.sqrt(a * a + b * b + c * c);
}
// this is realistic distance in 3D world
function manhattanDistance(start: Coordinates, end: Coordinates): number{
    let a: number = Math.abs(end.x - start.x);
    let b: number = Math.abs(end.y - start.y); 
    let c: number = Math.abs(end.z - start.z);

    return a + b + c;
}

export default { getShortestPath }