import { PromotionType } from './promotion-type';
import { User } from './user';

export class Promotion {
	id: number;
    name: string;
    image: string;
    image_thumbnail: string;
    short_description: string;
    content: string;
    promotion_category: string;
    promotion_label: string;
    promotion_type?: PromotionType;
    apply_date: Date;
    end_date: Date;
    QR_code: string;
    user_implementer: User;
    is_draft: boolean;
}
