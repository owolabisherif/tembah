import { MessageType, useReactlidate } from '@/hooks/use-reactlidate';
import Joi from 'joi';

export default function useFixtureValidator(data: object): {
    error: Joi.ValidationError | undefined;
    value: any;
    errorKeys: (string | number)[];
    messages: MessageType;
} {
    const rules = {
        id: Joi.number().allow(null),
        slug: Joi.any(),
        fixture_id: Joi.number().allow('').allow(null),
        static_id: Joi.number().allow('').allow(null),
        league_id: Joi.number().allow('').allow(null),
        home_team_id: Joi.number().allow('').allow(null),
        away_team_id: Joi.number().allow('').allow(null),
        league: Joi.string().allow('').allow(null),
        country: Joi.string().allow('').allow(null),
        date: Joi.string().allow('').allow(null),
        sort: Joi.number(),
        match: Joi.any(),
        meta_title: Joi.string().optional().allow(''),
        meta_title_ar: Joi.string().optional().allow(''),
        meta_desc: Joi.string().optional().allow(''),
        meta_desc_ar: Joi.string().optional().allow(''),
        keywords: Joi.string().optional().allow(''),
        keywords_ar: Joi.string().optional().allow(''),
        _method: Joi.string(),
        by_pass: Joi.boolean().required(),
        created_at: Joi.string().required(),
    };

    let $rd = useReactlidate(rules, data);

    return $rd;
}
