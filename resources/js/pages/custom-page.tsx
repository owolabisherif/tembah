import GuestLayout from '@/layouts/guest-layout';
import i18next from 'i18next';

type CustomPage = {
    slug: string;
    pageData: {
        slug: string;
        title: string;
        title_ar: string;
        body: string;
        body_ar: string;
    };
};
export default function CustomPage({ slug, pageData }: CustomPage) {
    return (
        <GuestLayout title={i18next.language == 'en' ? pageData.title : pageData.title_ar}>
            <div className="mb-10">
                <h1 className="text-lg font-bold">{i18next.language == 'en' ? pageData.title : pageData.title_ar}</h1>
            </div>

            <div
                className="prose max-w-full"
                dir={i18next.dir()}
                dangerouslySetInnerHTML={{ __html: i18next.language == 'en' ? pageData.body : pageData.body_ar }}
            ></div>
        </GuestLayout>
    );
}
