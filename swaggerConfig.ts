import swaggerJsdoc from 'swagger-jsdoc'

const options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'Mooladhara',
			version: '1.0.0',
			description: `API documentation for my TypeScript Node.js application.

			
Common Responses

- 401 Token Not Found:
  - Example:
    {
       "httpStatus": 401
	   "message": "Token Not Found."
	}

- 404 Not Found:
  - Example: 
    {
      "httpStatus": 404,
      "message": "Not Found - User with the specified ID not found"
    }

- 500 Internal Server Error:
  - Example: 
    {
      "httpStatus": 500,
      "message": "Internal Server Error"
    }
      `,
		},
		components: {
			securitySchemes: {
				authToken: {
					type: 'apiKey',
					in: 'header',
					name: 'authToken',
				},
			},
		},
		servers: [
			{
				url: 'http://localhost:3004/api',
			},
		],
	},
	apis: ['src/routes/**/**/*.ts'], // Include all TypeScript files you want to document
}

const swaggerSpec = swaggerJsdoc(options)

export default swaggerSpec
