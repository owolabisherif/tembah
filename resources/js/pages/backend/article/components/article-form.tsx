import SubmitScheduleDropdown from '@/components/submit-schedule-button';
import DropZone from '@/components/ui/dropzone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MessageBox from '@/components/ui/message-box';
import QuillEditor from '@/components/ui/quill-editor';
import { Select as RadSelect, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { CreateNewsProp, SubmitScheduleButtonData } from '@/types';
import useArticleValidator from '@/validators/use-article-validator';
import axios from 'axios';
import { ChangeEvent, startTransition, useEffect, useOptimistic, useRef, useState } from 'react';
import makeAnimated from 'react-select/animated';
import Select from 'react-select/creatable';

type NewsOptionType = 'text' | 'video';

type NewsFormType = {
    id: number | null;
    title: string;
    title_ar: string;
    type: NewsOptionType;
    author: string;
    body: string;
    body_ar: string;
    images: any[];
    tags: any[];
    leagues: any[];
    teams: any[];
    players: any[];
    action: SubmitScheduleButtonData | null;
    video: string | null;
    meta_title: string | null;
    meta_title_ar: string | null;
    meta_desc: string | null;
    meta_desc_ar: string | null;
    status: boolean;
    in_slider: boolean;
};

interface SelectType {
    readonly value: string;
    readonly label: string;
    readonly color: string;
    readonly isFixed?: boolean;
    readonly isDisabled?: boolean;
}

type NewOption = {
    title?: string;
    titleAr?: string;
    location?: string;
};

export default function ArticleForm({ newsTypes, authors, teams, leagues, players, ...props }: CreateNewsProp) {
    const bodyRef = useRef<any>(null);
    const bodyArRef = useRef<any>(null);
    const submitButtonRef = useRef<any>(null);
    const dropZone = useRef<any>(null);
    const dropVideoZone = useRef<any>(null);
    const [categories, setCategories] = useState<SelectType[]>([]);
    const [processing, setProcessing] = useState<boolean>(false);
    const [teamOptions, setTeamOptions] = useState<SelectType[]>([]);
    const [leagueOptions, setLeagueOptions] = useState<SelectType[]>([]);
    const [playerOptions, setPlayerOptions] = useState<SelectType[]>([]);
    const [tags, setTags] = useState<SelectType[]>([]);
    const [message, setMessage] = useState<string[]>([]);
    const [messageType, setMessageType] = useState<'error' | 'success' | 'info'>('error');
    const [productCategories, setProductCategories] = useState<SelectType[]>([]);
    const [productTags, setProductTags] = useState<SelectType[]>([]);
    const [form, setForm] = useState<NewsFormType>({
        id: null,
        title: '',
        title_ar: '',
        author: '',
        type: 'text',
        body: '',
        body_ar: '',
        images: [''],
        video: '',
        meta_title: '',
        meta_title_ar: '',
        meta_desc: '',
        meta_desc_ar: '',
        action: null,
        tags: [],
        leagues: [],
        teams: [],
        players: [],
        status: true,
        in_slider: false,
    });

    const { error, value, errorKeys, messages } = useArticleValidator(form);

    useEffect(() => {
        let teamData: SelectType[] = [];
        let leagueData: SelectType[] = [];
        let playerData: SelectType[] = [];

        if (leagues?.length) {
            for (const league of leagues) {
                leagueData = [...leagueData, { value: league.value.toString(), label: league.text, color: '#000000' }];
            }

            setLeagueOptions(leagueData);
        }

        if (teams?.length) {
            for (const team of teams) {
                teamData = [...teamData, { value: team.value.toString(), label: team.text, color: '#000000' }];
            }

            setTeamOptions(teamData);
        }

        if (players?.length) {
            for (const player of players) {
                playerData = [...playerData, { value: player.value.toString(), label: player.text, color: '#000000' }];
            }

            setPlayerOptions(playerData);
        }
    }, [leagues, teams, players]);

    useEffect(() => {
        getRemoteData();
    }, []);

    const resetForm = () => {
        dropZone.current?.reset();
        dropVideoZone.current?.reset();

        setForm({
            id: null,
            title: '',
            title_ar: '',
            author: '1',
            type: 'text',
            body: '',
            body_ar: '',
            images: [''],
            video: '',
            meta_title: '',
            meta_title_ar: '',
            meta_desc: '',
            meta_desc_ar: '',
            action: null,
            tags: [],
            leagues: [],
            teams: [],
            players: [],
            status: true,
            in_slider: false,
        });

        bodyRef.current.setContents([]);
        bodyArRef.current.setContents([]);
        bodyArRef.current.format('direction', 'rtl');
        bodyArRef.current.format('align', 'right');
        submitButtonRef.current?.reset();

        window?.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth',
        });
    };

    const getRemoteData = async () => {
        let tagData: SelectType[] = [];

        const tagsReq = await axios.get(route('dropdown.tags'));

        for (const tag of tagsReq.data) {
            tagData.push({ value: tag.value.toString(), label: tag.text, color: '#000000' });
        }

        setTags(tagData);
    };

    const [optiTags, setOptiTags] = useOptimistic<SelectType[], NewOption>(tags, (state, newTag) => [
        {
            value: (+tags[tags.length - 1].value + 1).toString(),
            label: `${newTag.title} (${newTag.titleAr})`,
            color: '#000000',
        },
        ...state,
    ]);

    const handleChange = (e: ChangeEvent<any>) => {
        const key = e.target.id;
        const value = e.target.value;
        setForm((values) => ({
            ...values,
            [key]: value,
        }));
    };

    const handleCustomChange = (key: string, val: any) => {
        setForm((values) => ({
            ...values,
            [key]: val,
        }));
    };

    const updateImage = (index: number, file: File) => {
        let images = [...form.images];
        images[index] = file;

        setForm((values) => ({
            ...values,
            ['images']: images,
        }));
    };

    const handleCreateNewOption = async (key: 'category' | 'tag', payload: string) => {
        let data: NewOption = {};

        let endPoints = {
            category: route('category.store'),
            tag: route('tag.store'),
        };

        startTransition(async () => {
            let dataNew = payload.split('/');
            if (dataNew.length < 2) return;

            data.title = dataNew[0];
            data.titleAr = dataNew[1];

            setOptiTags(data);

            const res = await axios.post(endPoints[key], data);

            let resData = { value: res.data.value, label: res.data.text, color: '#000000' };

            setTags((val) => [resData, ...val]);
        });
    };

    const submit = async () => {
        setMessage([]);

        if (error) {
            setMessageType('error');
            setMessage((err) => [...err, error.message]);
            return;
        }

        submitButtonRef.current?.disabled();

        try {
            const res = await axios.post(route('article.store'), form, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setMessageType('success');
            setMessage((err) => [res.data.message]);

            resetForm();
        } catch (error) {
            setMessageType('error');
            setMessage((err) => [...err, (error as any).response.data.message]);
            console.error(error);
        } finally {
            submitButtonRef.current?.enabled();
        }
    };

    return (
        <>
            {Boolean(Object.values(message).length) && (
                <MessageBox
                    type={messageType}
                    title={messageType == 'error' ? 'The following error(s) occured:' : null}
                    className="mb-5"
                    close={() => setMessage([])}
                >
                    <p className="text-xs">
                        {Object.values(message).map((item, i) => item + `${i != Object.values(message).length - 1 ? ', ' : ''}`)}
                    </p>
                </MessageBox>
            )}
            <form className="grid h-full grid-cols-12 gap-x-4">
                <div className="col-span-8 h-full">
                    <div className={cn('border-brand-gray h-full rounded-sm border p-4 shadow-sm')}>
                        <div className="grid grid-cols-12 gap-x-3">
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="title">Title (English)</Label>
                                <Input id="title" type="text" name="title" required value={form.title} onChange={(e) => handleChange(e)} />
                                {errorKeys.includes('title') && <p className="text-xs text-red-500">{messages['title']}</p>}
                            </div>
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="titleAr">Title (Arabic)</Label>
                                <Input
                                    id="title_ar"
                                    type="text"
                                    name="title_ar"
                                    dir="rtl"
                                    required
                                    value={form.title_ar}
                                    onChange={(e) => handleChange(e)}
                                />
                                {errorKeys.includes('title_ar') && <p className="text-xs text-red-500">{messages['title_ar']}</p>}
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="type">Type</Label>
                                <RadSelect value={form.type} defaultValue={form.type} onValueChange={(val) => handleCustomChange('type', val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {newsTypes?.map((item) => (
                                            <SelectItem value={item.value} key={item.value}>
                                                {item.text}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </RadSelect>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="author">Author</Label>
                                <RadSelect value={form.author} onValueChange={(val) => handleCustomChange('author', val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select author" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {authors?.map((item) => (
                                            <SelectItem value={item.value} key={item.value}>
                                                {item.text}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </RadSelect>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="body">Body (English)</Label>
                                <QuillEditor
                                    ref={bodyRef}
                                    readOnly={false}
                                    value={form.body}
                                    onSelectionChange={null}
                                    onTextChange={null}
                                    onChange={(data: any) => handleCustomChange('body', data)}
                                    discardChange={null}
                                    textDirection="ltr"
                                />
                                {errorKeys.includes('body') && <p className="text-xs text-red-500">{messages['body']}</p>}
                            </div>
                            <div className="col-span-12 mb-1">
                                <Label htmlFor="body_ar">Body (Arabic)</Label>
                                <QuillEditor
                                    ref={bodyArRef}
                                    readOnly={false}
                                    value={form.body_ar}
                                    onSelectionChange={null}
                                    onTextChange={null}
                                    textDirection="rtl"
                                    onChange={(data: any) => handleCustomChange('body_ar', data)}
                                    discardChange={null}
                                />
                                {errorKeys.includes('body_ar') && <p className="text-xs text-red-500">{messages['body_ar']}</p>}
                            </div>
                        </div>
                        <div className="col-span-12 mb-1">
                            <h3 className="my-3 font-bold">Media</h3>
                            <div className="grid grid-cols-12 gap-x-5">
                                <div className={cn(form.type == 'text' ? 'col-span-4 h-40' : 'col-span-6')}>
                                    <DropZone
                                        value={form.images && form.images.length ? form.images[0] : ''}
                                        onChange={(file: File) => updateImage(0, file)}
                                        className="h-full border-solid"
                                        acceptedFilesType={{ 'image/*': [] }}
                                        allowMultiple={false}
                                        onDragMessage={'Drop an image.'}
                                        ref={dropZone}
                                    />
                                </div>
                                <div className={cn(form.type == 'text' ? 'col-span-8' : 'col-span-6')}>
                                    <div className={cn('h-40 w-full', form.type !== 'video' && 'hidden')}>
                                        <DropZone
                                            value={form.video ?? ''}
                                            onChange={(file: File) => handleCustomChange('video', file)}
                                            className="h-full"
                                            acceptedFilesType={{ 'video/*': [] }}
                                            onDragMessage="Drop a video."
                                            allowMultiple={false}
                                            ref={dropVideoZone}
                                        />
                                    </div>
                                </div>
                            </div>
                            {errorKeys.includes('images') && <p className="text-xs text-red-500">{messages['images']}</p>}
                        </div>
                        <div className="mt-10">
                            <div className="flex w-full justify-end">
                                <SubmitScheduleDropdown
                                    value={form.action ?? { type: 'now', payload: '' }}
                                    defaultText={`${form.action?.type == 'schedule' ? 'Schedule Post' : 'Post Now'}  `}
                                    onChange={(data) => handleCustomChange('action', data)}
                                    disabled={processing}
                                    handleSubmit={() => submit()}
                                    ref={submitButtonRef}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-span-4 h-full">
                    <div className="border-brand-gray h-full rounded-sm border p-3 shadow-sm">
                        <div className="mb-5">
                            <h3 className="font-bold">Article settings</h3>
                            <p className="text-xs font-bold text-red-500">
                                To create new category or tags: type
                                <span className="font-bold">
                                    {` {English text}/{Arabic text}`} without the {` {}`}
                                </span>
                            </p>
                        </div>
                        <div className="col-span-12">
                            {optiTags.length ? (
                                <div className="col-span-12 mb-1">
                                    <Label htmlFor="tag">Tags</Label>
                                    <Select
                                        closeMenuOnSelect={false}
                                        components={makeAnimated()}
                                        isSearchable
                                        isClearable
                                        isMulti
                                        name="tags"
                                        defaultValue={[...productTags]}
                                        value={form.tags}
                                        options={optiTags}
                                        onCreateOption={(val) => handleCreateNewOption('tag', val)}
                                        onChange={(val) => handleCustomChange('tags', val)}
                                        classNames={{
                                            control: (state) =>
                                                '!border-input !rounded-md !outline-none !active:outline-none !shadow-xs !focus-visible:ring-[3px]',
                                        }}
                                    />
                                </div>
                            ) : (
                                ''
                            )}

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="teams">Related Team(s)</Label>
                                <Select
                                    closeMenuOnSelect={false}
                                    components={makeAnimated()}
                                    isSearchable
                                    isClearable
                                    isMulti
                                    name="teams"
                                    defaultValue={[]}
                                    value={form.teams}
                                    options={teamOptions}
                                    onChange={(val) => handleCustomChange('teams', val)}
                                    classNames={{
                                        control: (state) =>
                                            '!border-input !rounded-md !outline-none !active:outline-none !shadow-xs !focus-visible:ring-[3px]',
                                    }}
                                />
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="leagues">Related League(s)</Label>
                                <Select
                                    closeMenuOnSelect={false}
                                    components={makeAnimated()}
                                    isSearchable
                                    isClearable
                                    isMulti
                                    name="leagues"
                                    defaultValue={[]}
                                    value={form.leagues}
                                    options={leagueOptions}
                                    onChange={(val) => handleCustomChange('leagues', val)}
                                    classNames={{
                                        control: (state) =>
                                            '!border-input !rounded-md !outline-none !active:outline-none !shadow-xs !focus-visible:ring-[3px]',
                                    }}
                                />
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="players">Related Player(s)</Label>
                                <Select
                                    closeMenuOnSelect={false}
                                    components={makeAnimated()}
                                    isSearchable
                                    isClearable
                                    isMulti
                                    name="players"
                                    defaultValue={[]}
                                    value={form.players}
                                    options={playerOptions}
                                    onChange={(val) => handleCustomChange('players', val)}
                                    classNames={{
                                        control: (state) =>
                                            '!border-input !rounded-md !outline-none !active:outline-none !shadow-xs !focus-visible:ring-[3px]',
                                    }}
                                />
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="slider">Add to SLIDER list ?</Label>
                                <RadSelect
                                    defaultValue={'no'}
                                    onValueChange={(val) => handleCustomChange('in_slider', val === 'yes' ? true : false)}
                                    value={form.in_slider ? 'yes' : 'no'}
                                    name="slider"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select one" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="yes">Yes</SelectItem>
                                        <SelectItem value="no">No</SelectItem>
                                    </SelectContent>
                                </RadSelect>
                            </div>

                            <div className="col-span-12 mb-1">
                                <Label htmlFor="status">Status</Label>
                                <RadSelect
                                    defaultValue={'active'}
                                    onValueChange={(val) => handleCustomChange('status', val === 'active' ? true : false)}
                                    value={form.status ? 'active' : 'inactive'}
                                    name="status"
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select one" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="inactive">Inactive</SelectItem>
                                    </SelectContent>
                                </RadSelect>
                            </div>
                        </div>

                        <h3 className="my-5 font-bold">SEO (optional)</h3>
                        <div className="col-span-12 mb-1">
                            <Label htmlFor="meta_title">Meta title</Label>
                            <Input
                                id="meta_title"
                                type="text"
                                name="meta_title"
                                placeholder="Enter meta title"
                                value={form.meta_title ?? ''}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="col-span-12 mb-1">
                            <Label htmlFor="meta_title_ar">Meta title (Arabic)</Label>
                            <Input
                                id="meta_title_ar"
                                type="text"
                                name="meta_title_ar"
                                placeholder="Enter meta title (arabic)"
                                value={form.meta_title_ar ?? ''}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                        <div className="col-span-12 mb-1">
                            <Label htmlFor="meta_desc">Meta description</Label>
                            <textarea
                                id="meta_desc"
                                name="meta_desc"
                                placeholder="Enter meta description"
                                className="block w-full resize-none rounded-sm border border-input p-2 shadow-sm placeholder:text-xs focus:outline-0"
                                value={form.meta_desc ?? ''}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>

                        <div className="col-span-12 mb-1">
                            <Label htmlFor="meta_desc_ar">Meta description (Arabic)</Label>
                            <textarea
                                id="meta_desc_ar"
                                name="meta_desc_ar"
                                placeholder="Enter meta description (arabic)"
                                className="block w-full resize-none rounded-sm border border-input p-2 shadow-sm placeholder:text-xs focus:outline-0"
                                value={form.meta_desc_ar ?? ''}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
}
