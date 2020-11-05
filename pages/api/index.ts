import { NextApiRequest, NextApiResponse } from "next";


/**
 * Default api endpoint
 */
export default (req: NextApiRequest, res: NextApiResponse): void => {
  res.status(200).send(`moo!`);
};
