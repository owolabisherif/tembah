import { cn } from '@/lib/utils';
import { PropsWithChildren } from 'react';

type Position = 'left' | 'right';

type AsideType = {
    pos: Position;
};

export default function AsideAd(prop: PropsWithChildren<AsideType>) {
    return (
        <div className="h-full">
            <div className="sticky top-0 bottom-0">
                <div className={cn('mb-10 flex h-screen w-full justify-end', prop.pos == 'left' ? 'justify-end' : 'justify-start')}>
                    <div className="w-[160px] rounded-sm">
                        <iframe
                            id="ac1bd78c"
                            name="ac1bd78c"
                            src="https://emqatar.com/adserver/www/delivery/afr.php?zoneid=2&amp;cb=45324234343"
                            frameBorder="0"
                            scrolling="no"
                            className="h-full w-full"
                            allow="autoplay"
                        >
                            <a
                                href="https://emqatar.com/adserver/www/delivery/ck.php?n=ac1be192&amp;cb=45324234343"
                                target="_blank"
                                className="block h-full w-full"
                            >
                                <img
                                    src="https://emqatar.com/adserver/www/delivery/avw.php?zoneid=2&amp;cb=45324234343&amp;n=ac1be192"
                                    alt=""
                                    className="h-full w-full object-contain"
                                />
                            </a>
                        </iframe>
                    </div>
                </div>
            </div>
        </div>
    );
}
