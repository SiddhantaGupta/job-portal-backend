import { ValidationFailed } from '@libs/boat';
import axios from 'axios';

async function validateAdminRecaptcha(
  reCaptchaToken: string,
): Promise<boolean> {
  let resp = await axios.post(
    `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${reCaptchaToken}`,
  );
  if (resp.data && resp.data.success) {
    return true;
  }
  throw new ValidationFailed({ reCaptcha: 'Invalid Recaptcha' });
}

export default validateAdminRecaptcha;
