import Joi from 'joi';

export interface MessageType {
    [key: string]: string;
}

export function useReactlidate(
    rules: object,
    data: object,
): { error: Joi.ValidationError | undefined; value: any; errorKeys: (string | number)[]; messages: MessageType } {
    const schema = Joi.object(rules);

    const { error, value } = schema.validate(data, { abortEarly: false });

    let errorKeys: (string | number)[] = [];
    let messages: MessageType = {};

    errorKeys = [];
    messages = {};

    if (error) {
        for (const item of error.details) {
            errorKeys = [...errorKeys, ...item.path];
            messages[item.path[0]] = item.message;
        }
    }

    return { error, value, errorKeys, messages };
}
