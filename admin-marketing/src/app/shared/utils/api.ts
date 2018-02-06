import { env } from '../../../environments/environment';

export const api = {
  	promotion_list: env.api_domain + 'promotion_list/', 
  	promotion_detail: env.api_domain + 'promotion/',
  	user_promotion: env.api_domain + 'user_promotion/'
};
