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

    hot_advs: env.api_domain + 'hot_advs/',

    promotion_label: env.api_domain + 'promotion_label/',
    promotion_label_list: env.api_domain + 'promotion_label_list/',
    promotion_type: env.api_domain + 'promotion-type/',


    banner: env.api_domain + 'banner/',
    fee: env.api_domain + 'fee/',
    fee_list: env.api_domain + 'fee_list/',

    category_notifications: env.api_domain +'category_notifications/',

    hot: env.api_domain + 'hot/',
    hot_list: env.api_domain + 'hot_list/',

    post: env.api_domain + 'post/',
    post_list: env.api_domain + 'post_list/',

    event: env.api_domain + 'event/',

    event_list: env.api_domain + 'event_list/',

    /* URL generator QR Code from Promotion ID ( POST )*/
    generator_QR_code: env.api_domain + 'generator_QR_code/',
    /* Get All Category */
    category_list: env.api_domain +'category_list/',
    post_type_list: env.api_domain +'post_type_list/',
    login: env.api_domain +'accounts/login/',

    users: env.api_domain + 'users/',

    role: env.api_domain + 'role/',

};
