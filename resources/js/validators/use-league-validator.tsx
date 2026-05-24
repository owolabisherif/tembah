import { MessageType, useReactlidate } from '@/hooks/use-reactlidate';
import Joi from 'joi';

export default function useLeagueValidator(data: object): {
    error: Joi.ValidationError | undefined;
    value: any;
    errorKeys: (string | number)[];
    messages: MessageType;
} {
    const rules = {
        id: Joi.number().allow(null),
        country_id: Joi.number(),
        name: Joi.string().required(),
        name_ar: Joi.string().required(),
        date_start: Joi.string(),
        date_end: Joi.string(),
        league_id: Joi.number().required(),
        is_top: Joi.boolean().required(),
        by_pass: Joi.boolean().required(),
        is_cup: Joi.boolean().required(),
        is_women: Joi.boolean().required(),
        live_lineups: Joi.boolean().required(),
        live_stats: Joi.boolean().required(),
        live_pbp: Joi.boolean().required(),
        _method: Joi.string(),
        status: Joi.required(),
        season: Joi.required(),
        meta_title: Joi.string().optional().allow(''),
        meta_title_ar: Joi.string().optional().allow(''),
        meta_desc: Joi.string().optional().allow(''),
        meta_desc_ar: Joi.string().optional().allow(''),
        keywords: Joi.string().optional().allow(''),
        keywords_ar: Joi.string().optional().allow(''),
        sort: Joi.number(),
        logo: Joi.custom((image, helpers) => {
            if (!(image instanceof File)) {
                return helpers.message({ custom: '"image" Upload a valid image' });
            }
            return image;
        }).allow(),
    };

    let $rd = useReactlidate(rules, data);

    return $rd;
}
