# Deployment Guide for CurrentMedia PMS

This guide provides step-by-step instructions for deploying the CurrentMedia Project Management System to Render.com.

## Prerequisites

Before deploying, ensure you have:

1. A [Render.com](https://render.com) account
2. A [GitHub](https://github.com) account
3. Your project code pushed to a GitHub repository
4. Your ClickUp API key

## Deployment Steps

### 1. Prepare Your Repository

Ensure your repository includes:

- The `render.yaml` file in the root directory
- All environment variables properly configured in `.env.example` files
- All dependencies listed in package.json files

### 2. Deploy Using Render Blueprint

The easiest way to deploy is using the Render Blueprint (render.yaml):

1. Log in to your Render.com account
2. Click on the "New +" button and select "Blueprint"
3. Connect your GitHub account if you haven't already
4. Select the repository containing your CurrentMedia PMS code
5. Render will detect the `render.yaml` file and show the services to be created
6. Click "Apply" to start the deployment process

### 3. Configure Environment Variables

After the services are created, you'll need to set up the environment variables:

1. Go to the Dashboard and select the `currentmedia-pms-api` service
2. Navigate to the "Environment" tab
3. Add the following environment variables:
   - `JWT_SECRET`: A secure random string for JWT token generation
   - `CLICKUP_API_KEY`: Your ClickUp API key
   - `CLICKUP_LIST_ID`: The ID of your ClickUp list containing projects

### 4. Verify Deployment

1. Once deployment is complete, click on the URL for the `currentmedia-pms-web` service
2. You should see the login page of the CurrentMedia PMS
3. Log in using the default credentials (if you haven't changed them):
   - Email: admin@currentmedia.ca
   - Password: admin123

### 5. Custom Domain Setup

To set up your custom domain (e.g., currentmedia.ca/pms):

1. Go to the `currentmedia-pms-web` service in Render
2. Navigate to the "Settings" tab
3. Under "Custom Domain", click "Add Custom Domain"
4. Enter your domain (e.g., currentmedia.ca)
5. Follow the DNS configuration instructions provided by Render
6. Once the domain is verified, set up a URL path redirect or rewrite rule to direct currentmedia.ca/pms to your Render app

## Troubleshooting

### Common Issues

1. **Build Failures**

   - Check the build logs for errors
   - Ensure all dependencies are correctly listed in package.json
   - Verify that the build commands in render.yaml are correct

2. **API Connection Issues**

   - Verify that the `VITE_API_URL` environment variable in the frontend service points to the correct backend URL
   - Check that CORS is properly configured in the backend

3. **ClickUp API Issues**
   - Verify your ClickUp API key is correct and has the necessary permissions
   - Check the server logs for any API rate limiting or authentication errors

### Logs and Monitoring

- Access logs for each service from the Render dashboard
- Set up alerts for service outages or errors in the Render dashboard

## Maintenance

### Updates and Redeployments

To update your application:

1. Push changes to your GitHub repository
2. Render will automatically detect the changes and redeploy (if auto-deploy is enabled)
3. Monitor the deployment logs to ensure successful updates

### Scaling

If you need to scale your application:

1. Go to the service in the Render dashboard
2. Navigate to the "Settings" tab
3. Under "Instance Type", select a higher tier plan
4. Save changes to apply the new instance type

## Support

If you encounter issues with the deployment, you can:

1. Check the Render documentation: https://render.com/docs
2. Contact Render support through their dashboard
3. Review the application logs for specific error messages

---

Remember to keep your API keys and secrets secure. Never commit them directly to your repository.
