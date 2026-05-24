import { MessageType, useReactlidate } from '@/hooks/use-reactlidate';
import Joi from 'joi';

export default function useArticleValidator(data: object): {
    error: Joi.ValidationError | undefined;
    value: any;
    errorKeys: (string | number)[];
    messages: MessageType;
} {
    const rules = {
        id: Joi.number().allow(null),
        title: Joi.string().required(),
        title_ar: Joi.string().required(),
        type: Joi.string().required(),
        body: Joi.string().required(),
        body_ar: Joi.string().required(),
        author: Joi.string().required(),
        _method: Joi.string(),
        images: Joi.array().custom((images, helpers) => {
            for (const image of images) {
                let msg: Joi.LanguageMessages = {
                    error: 'any.invalid',
                    message: 'Invalid image files',
                };

                if (!(image instanceof File)) {
                    return helpers.message({ custom: '"images" Upload a valid image' });
                }
            }

            return images;
        }),
        video: Joi.optional()
            .custom((video, helpers) => {
                let validVideos = [
                    'mp4',
                    'mov',
                    'avi',
                    'wmv',
                    'mkv',
                    'flv',
                    'webm',
                    '3gp',
                    '3g2',
                    'm4v',
                    'mpg',
                    'mpeg',
                    'ogv',
                    'asf',
                    'vob',
                    'm2ts',
                    'mts',
                    'ts',
                    'f4v',
                    'm4p',
                    'qt',
                    'rm',
                    'rmvb',
                    'amv',
                    'mxf',
                    'bik',
                    'mvi',
                    'divx',
                    'dv',
                    'gifv',
                ];

                const ext = video.name.slice(video.name.lastIndexOf('.') + 1);

                let sizeInMB = (video.size / (1024 * 1024)).toFixed(2);

                if (!(video instanceof File) || !validVideos.includes(ext)) return helpers.message({ custom: '"video" Upload a valid video' });

                if (+sizeInMB > 50) return helpers.message({ custom: '"video" Max allowed video size is 50MB' });
            })
            .allow(''),
        meta_title: Joi.string().optional().allow(''),
        meta_title_ar: Joi.string().optional().allow(''),
        meta_desc: Joi.string().optional().allow(''),
        meta_desc_ar: Joi.string().optional().allow(''),
        keywords: Joi.string().optional().allow(''),
        keywords_ar: Joi.string().optional().allow(''),
        action: Joi.required(),
        tags: Joi.any(),
        leagues: Joi.any(),
        teams: Joi.any(),
        players: Joi.any(),
        status: Joi.required(),
        in_slider: Joi.required(),
    };

    let $rd = useReactlidate(rules, data);

    return $rd;
}
