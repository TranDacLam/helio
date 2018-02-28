import { env } from '../../../environments/environment';

export const api = {
    /* URL Promotion Detail Page*/
    promotion: env.api_domain + 'promotion/',
    /* URL Promotion List ( GET, DELETE list promotion )*/
    promotion_list: env.api_domain + 'promotion_list/',
    /* URL User Promotion ( GET, PUT list promotion )*/
    user_promotion: env.api_domain + 'user_promotion/',
    notification: env.api_domain + 'notification/',
    user_notification: env.api_domain + 'user_notification/',
    notification_list: env.api_domain + 'notification_list/',
    user: env.api_domain + 'user/',
    user_embed: env.api_domain + 'user_embed/',
    relate: env.api_domain + 'relate/',
    delete_relate: env.api_domain + 'delete_relate/',
    summary: env.api_domain + 'summary/',

    user_link_card: env.api_domain + 'user_link_card/',

    feedback: env.api_domain + 'feedback/',

    advertisement: env.api_domain + 'advertisement/',

    denomination: env.api_domain + 'denomination/',

    hot_adv: env.api_domain + 'hot_adv/',

    promotion_label: env.api_domain + 'promotion_label/',

    promotion_type: env.api_domain + 'promotion-type/',


    banner: env.api_domain + 'banner/',
    fee: env.api_domain + 'fee/',

    category_notifications: env.api_domain +'category_notifications/',

    hot: env.api_domain + 'hot/',

    post: env.api_domain + 'post/',

    event: env.api_domain + 'event/',
    /* URL generator QR Code from Promotion ID ( POST )*/
    generator_QR_code: env.api_domain + 'generator_QR_code/',


};
