import { MessageType, useReactlidate } from '@/hooks/use-reactlidate';
import Joi from 'joi';

export default function useAuthorValidator(data: object): {
    error: Joi.ValidationError | undefined;
    value: any;
    errorKeys: (string | number)[];
    messages: MessageType;
} {
    const rules = {
        id: Joi.number().allow(null),
        name: Joi.string().required(),
        name_ar: Joi.string().required(),
        about: Joi.string().allow(''),
        about_ar: Joi.string().allow(''),
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
        meta_title: Joi.string().optional().allow(''),
        meta_title_ar: Joi.string().optional().allow(''),
        meta_desc: Joi.string().optional().allow(''),
        meta_desc_ar: Joi.string().optional().allow(''),
        web_url: Joi.string().uri().allow(''),
        x: Joi.string().uri().allow(''),
        instagram: Joi.string().uri().allow(''),
        whatsapp: Joi.string().uri().allow(''),
        facebook: Joi.string().uri().allow(''),
        status: Joi.required(),
    };

    let $rd = useReactlidate(rules, data);

    return $rd;
}
