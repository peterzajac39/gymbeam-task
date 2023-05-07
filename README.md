# Gymbeam task

Simple nodejs server for gymbeam task for nodejs developer.

## Development server

Install packages with `npm install`

Input API key for https://dev.aux.boxpi.com/case-study/ URL into `.env` file

Run Node.js server with `npm run dev`

Make GET request for `localhost:3000/getPath` with request body for example 
```
{
    "products": ["product-1", "product-2", "product-5"],
    "start": {
        "x": 0,
        "y": 0,
        "z": 0
    }
}
```

Expected results are in JSON format as following:
```
{
    "pickingOrder": [
        {
            "productId": "product-1",
            "positionId": "position-31"
        },
        {
            "productId": "product-2",
            "positionId": "position-241"
        },
        {
            "productId": "product-5",
            "positionId": "position-216"
        }
    ],
    "distance": 29
}
```
