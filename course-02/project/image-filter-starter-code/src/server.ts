import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  
  
  
  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
app.get("/filteredimage" ,async (req: express.Request, res: express.Response) => { 
  try {
    let { image_url } : {image_url:string}= req.query;
    if(!image_url) {
      return res.status(400)
         .send("The image url is missing")
    }
    // endpoint to filter an image from a public url.
    const filteredimage = await filterImageFromURL(image_url.toString())
    res.status(200)
      .sendFile(filteredimage)
    res.on('finish', () => deleteLocalFiles([filteredimage]));  
  }
  catch(error){
    return res.status(500)
       .send("failed to download image")
  }
  
});
  //! END @TODO1

  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();