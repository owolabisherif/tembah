import { MessageType, useReactlidate } from '@/hooks/use-reactlidate';
import Joi from 'joi';

export default function usePlayerValidator(data: object): {
    error: Joi.ValidationError | undefined;
    value: any;
    errorKeys: (string | number)[];
    messages: MessageType;
} {
    const rules = {
        id: Joi.number().allow(null),
        player_id: Joi.number(),
        team_id: Joi.number(),
        national_team_id: Joi.number().allow('').allow(null),
        name: Joi.string().required(),
        name_ar: Joi.string().required(),
        common_name: Joi.string().allow('').allow(null),
        common_name_ar: Joi.string().allow('').allow(null),
        firstname: Joi.string().allow('').allow(null),
        firstname_ar: Joi.string().allow('').allow(null),
        lastname: Joi.string().allow('').allow(null),
        lastname_ar: Joi.string().allow('').allow(null),
        fullname: Joi.string().allow('').allow(null),
        fullname_ar: Joi.string().allow('').allow(null),
        nationality_flag: Joi.string().allow('').allow(null),
        nationality: Joi.string().allow('').allow(null),
        nationality_ar: Joi.string().allow('').allow(null),
        team: Joi.string().allow('').allow(null),
        team_ar: Joi.string().allow('').allow(null),
        team_flag: Joi.string().allow('').allow(null),
        birthdate: Joi.string().allow('').allow(null),
        birthdate_ar: Joi.string().allow('').allow(null),
        age: Joi.string().allow('').allow(null),
        age_ar: Joi.string().allow('').allow(null),
        birth_country: Joi.string().allow('').allow(null),
        birth_country_flag: Joi.string().allow('').allow(null),
        birth_country_ar: Joi.string().allow('').allow(null),
        birth_place: Joi.string().allow('').allow(null),
        birth_place_ar: Joi.string().allow('').allow(null),
        position: Joi.string().allow('').allow(null),
        position_ar: Joi.string().allow('').allow(null),
        height: Joi.string().allow('').allow(null),
        height_ar: Joi.string().allow('').allow(null),
        shirt: Joi.string().allow('').allow(null),
        shirt_ar: Joi.string().allow('').allow(null),
        weight: Joi.string().allow('').allow(null),
        weight_ar: Joi.string().allow('').allow(null),
        preferred_foot: Joi.string().allow('').allow(null),
        preferred_foot_ar: Joi.string().allow('').allow(null),
        market_value: Joi.string().allow('').allow(null),
        image: Joi.custom((image, helpers) => {
            if (!image) return true;

            if (!(image instanceof File)) {
                return helpers.message({ custom: '"image" Upload a valid image' });
            }
            return image;
        }).allow(),
        statistic: Joi.any().required(),
        statistic_cups: Joi.any().required(),
        statistic_cups_intl: Joi.any().required(),
        statistic_intl: Joi.any().required(),
        trophies: Joi.any().required(),
        transfers: Joi.any().required(),
        sidelined: Joi.any().required(),
        overall_clubs: Joi.any().required(),
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
