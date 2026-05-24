import { MessageType, useReactlidate } from '@/hooks/use-reactlidate';
import Joi from 'joi';

export default function useSeoPageValidator(data: object): {
    error: Joi.ValidationError | undefined;
    value: any;
    errorKeys: (string | number)[];
    messages: MessageType;
} {
    const rules = {
        id: Joi.number().allow(null),
        page: Joi.string().required(),
        _method: Joi.string().allow(''),
        slug: Joi.string().allow(''),
        title: Joi.string().allow(''),
        title_ar: Joi.string().allow(''),
        meta_title: Joi.string().required(),
        meta_title_ar: Joi.string().required(),
        meta_desc: Joi.string().required(),
        meta_desc_ar: Joi.string().required(),
        keywords: Joi.string().required(),
        keywords_ar: Joi.string().required(),
        has_body: Joi.boolean(),
        is_default: Joi.boolean(),
        body: Joi.string().allow(null),
        body_ar: Joi.string().allow(null),
    };

    let $rd = useReactlidate(rules, data);

    return $rd;
}
