import { MessageType, useReactlidate } from '@/hooks/use-reactlidate';
import Joi from 'joi';

export default function useTagValidator(data: object): {
    error: Joi.ValidationError | undefined;
    value: any;
    errorKeys: (string | number)[];
    messages: MessageType;
} {
    const rules = {
        id: Joi.number().allow(null),
        title: Joi.string().required(),
        titleAr: Joi.string().required(),
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
        status: Joi.required(),
        _method: Joi.string(),
        meta_title: Joi.string().optional().allow(''),
        meta_title_ar: Joi.string().optional().allow(''),
        meta_desc: Joi.string().optional().allow(''),
        meta_desc_ar: Joi.string().optional().allow(''),
    };

    let $rd = useReactlidate(rules, data);

    return $rd;
}
