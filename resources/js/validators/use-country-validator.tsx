import { MessageType, useReactlidate } from '@/hooks/use-reactlidate';
import Joi from 'joi';

export default function useCountryValidator(data: object): {
    error: Joi.ValidationError | undefined;
    value: any;
    errorKeys: (string | number)[];
    messages: MessageType;
} {
    const rules = {
        id: Joi.number().allow(null),
        name: Joi.string().required(),
        name_ar: Joi.string().required(),
        _method: Joi.string(),
        status: Joi.required(),
        meta_title: Joi.string().optional().allow(''),
        meta_title_ar: Joi.string().optional().allow(''),
        meta_desc: Joi.string().optional().allow(''),
        meta_desc_ar: Joi.string().optional().allow(''),
        keywords: Joi.string().optional().allow(''),
        keywords_ar: Joi.string().optional().allow(''),
        sort: Joi.number(),
        images: Joi.array()
            .custom((images, helpers) => {
                for (const image of images) {
                    if (!(image instanceof File)) {
                        return helpers.message({ custom: '"images" Upload a valid image' });
                    }
                }

                return images;
            })
            .allow(),
    };

    let $rd = useReactlidate(rules, data);

    return $rd;
}
