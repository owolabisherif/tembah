import { MessageType, useReactlidate } from '@/hooks/use-reactlidate';
import Joi from 'joi';

export default function useTeamValidator(data: object): {
    error: Joi.ValidationError | undefined;
    value: any;
    errorKeys: (string | number)[];
    messages: MessageType;
} {
    const rules = {
        id: Joi.number().allow(null),
        slug: Joi.string().allow(''),
        team_id: Joi.number(),
        venue_id: Joi.number(),
        is_women: Joi.boolean().required(),
        is_national_team: Joi.boolean().required(),
        country_id: Joi.number(),
        name: Joi.string().required(),
        name_ar: Joi.string().required(),
        fullname: Joi.string().required(),
        fullname_ar: Joi.string().allow(),
        founded: Joi.string().required(),
        founded_ar: Joi.any().allow(),
        venue_name: Joi.string().required(),
        venue_name_ar: Joi.any().allow(),
        venue_surface: Joi.string().required(),
        leagues: Joi.any().required(),
        venue_address: Joi.any().required(),
        venue_city: Joi.any().required(),
        venue_capacity: Joi.string().required(),
        venue_capacity_ar: Joi.any().allow(),
        squad: Joi.any().required(),
        coach: Joi.any().required(),
        transfers: Joi.any().required(),
        statistics: Joi.any().required(),
        detailed_stats: Joi.any().required(),
        sidelined: Joi.any().required(),
        trophies: Joi.any().required(),
        image: Joi.custom((image, helpers) => {
            if (!(image instanceof File)) {
                return helpers.message({ custom: '"image" Upload a valid image' });
            }
            return image;
        }).allow(),
        venue_image: Joi.custom((image, helpers) => {
            if (!(image instanceof File)) {
                return helpers.message({ custom: '"image" Upload a valid image' });
            }
            return image;
        }).allow(),
        meta_title: Joi.string().optional().allow(''),
        meta_title_ar: Joi.string().optional().allow(''),
        meta_desc: Joi.string().optional().allow(''),
        meta_desc_ar: Joi.string().optional().allow(''),
        keywords: Joi.string().optional().allow(''),
        keywords_ar: Joi.string().optional().allow(''),
        _method: Joi.string(),
        reload: Joi.boolean().required(),
        by_pass: Joi.boolean().required(),
        created_at: Joi.string().required(),
    };

    let $rd = useReactlidate(rules, data);

    return $rd;
}
