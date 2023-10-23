import type { NextApiRequest, NextApiResponse  } from "next";
import { validateSignature } from '../../utils/webhookSigning';

const HASHNODE_POST_UPDATE_WEBHOOK_SECRET = process.env.HASHNODE_POST_UPDATED_WEBHOOK_SECRET;

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (!HASHNODE_POST_UPDATE_WEBHOOK_SECRET) {
    return res.status(500).end();
  }
  const headers = req.headers;
  // const referrer = headers.referer;
  const webhookSignature = (req.headers['x-hashnode-signature'] as string);

  if (!webhookSignature) {
    return res.status(400).json({ message: 'Invalid request' });
  }
  const isValidSignature = validateSignature({ incomingSignatureHeader: webhookSignature, secret: HASHNODE_POST_UPDATE_WEBHOOK_SECRET, validForSeconds: 3 });

  if (!isValidSignature) {
    return res.status(403).json({ message: 'Not authenticated to make this request' })
  }
  return res.status(200).send({
    content:
      "This is protected content. You can access this content because signature is valid",
  });
};

export default handler;