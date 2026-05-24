import { cn } from '@/lib/utils';
import { Transition } from '@headlessui/react';
import { useForm } from '@inertiajs/react';
import i18next, { t } from 'i18next';
import { MailPlusIcon } from 'lucide-react';
import { FormEvent, useState } from 'react';

type NewsletterFormType = {
    email: string;
};

export default function NewsletterPage() {
    const [message, setMessage] = useState('');
    const { post, recentlySuccessful, hasErrors, processing, data, setData, reset } = useForm<NewsletterFormType>({
        email: '',
    });

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            if (data.email == '') return;

            post(route('newsletter.sub'), {
                preserveScroll: true,
                onError: (err) => {
                    setMessage(err.message);
                },
                onSuccess: (message) => {
                    setMessage('Thank you for subscribing.');
                    reset();
                },
            });
        } catch (error) {}
    };

    return (
        <>
            <h3 className="text-2xl font-bold">{t('Subscribe to Our Newsletter')}</h3>
            <p className="mb-5 text-xs">{t('Be the first to hear about latest news.')}</p>
            <Transition
                show={recentlySuccessful || hasErrors}
                enter="transition ease-in-out"
                enterFrom="opacity-0"
                leave="transition ease-in-out"
                leaveTo="opacity-0"
            >
                <p className={cn(recentlySuccessful ? 'text-green-500' : 'text-red-500')}>{message}</p>
            </Transition>
            <form className="flex" dir="ltr" onSubmit={submit}>
                <button
                    className="cursor-pointer rounded-l-sm bg-red-600 px-5 hover:bg-red-800 disabled:bg-gray-400"
                    disabled={processing}
                    type="submit"
                >
                    <MailPlusIcon />
                </button>
                <input
                    value={data.email}
                    onChange={(e) => setData('email', (e.target as HTMLInputElement).value)}
                    type="email"
                    dir={i18next.dir()}
                    className="w-full rounded-r-sm border border-l-0 border-gray-400 py-2 pl-3 outline-0 placeholder:text-xs focus:outline-0"
                    placeholder={t('Please enter your email here.')}
                />
            </form>
        </>
    );
}
