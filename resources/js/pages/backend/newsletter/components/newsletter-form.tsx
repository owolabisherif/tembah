import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MessageBox from '@/components/ui/message-box';
import QuillEditor from '@/components/ui/quill-editor';
import { cn } from '@/lib/utils';
import { useForm } from '@inertiajs/react';
import { FormEvent, useRef } from 'react';

type NewsletterFormType = {
    subject: string;
    body: string;
};

export default function NewsletterForm() {
    const bodyRef = useRef<any>(null);
    const { data, setData, recentlySuccessful, hasErrors, processing, errors, reset, post } = useForm<NewsletterFormType>({
        subject: '',
        body: '',
    });

    const submit = async (e: FormEvent) => {
        e.preventDefault();
        try {
            post(route('newsletter.store'), {
                preserveScroll: true,
                onSuccess: () => {},
                onError: (err) => {},
            });
        } catch (error) {}
    };

    return (
        <>
            {recentlySuccessful || hasErrors ? (
                <MessageBox
                    type={recentlySuccessful ? 'success' : 'error'}
                    title={hasErrors ? 'The following error(s) occured:' : null}
                    className="mb-5"
                >
                    {recentlySuccessful ? (
                        'Newsletter was sent successfully'
                    ) : (
                        <p className="text-xs">
                            {Object.values(errors).map((item, i) => item + `${i != Object.values(errors).length - 1 ? ', ' : ''}`)}
                        </p>
                    )}
                </MessageBox>
            ) : (
                ''
            )}
            <form className="grid h-full grid-cols-12 gap-x-4" onSubmit={submit}>
                <div className="col-span-12 h-full">
                    <div className={cn('border-brand-gray h-full rounded-sm border p-4 shadow-sm')}>
                        <div className="grid grid-cols-12 gap-x-3">
                            <div className="col-span-12 mb-5">
                                <Label htmlFor="subject">Subject</Label>
                                <Input
                                    id="subject"
                                    type="text"
                                    name="subject"
                                    required
                                    value={data.subject}
                                    onChange={(e) => setData('subject', e.target.value)}
                                />
                            </div>

                            <div className="col-span-12 mb-5">
                                <Label htmlFor="body">Body</Label>
                                <QuillEditor
                                    ref={bodyRef}
                                    readOnly={false}
                                    value={data.body}
                                    onSelectionChange={null}
                                    onTextChange={null}
                                    textDirection="ltr"
                                    onChange={(data: any) => setData('body', data)}
                                    discardChange={null}
                                />
                            </div>

                            <div className="col-span-12 mt-2">
                                <Button className="px-5 font-bold" disabled={processing} type="submit">
                                    SEND
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
