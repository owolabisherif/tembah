import 'quill-table-up/index.css';
import 'quill-table-up/table-creator.css';

import Quill, {Delta} from 'quill';
import TableUp, { defaultCustomSelect, TableAlign, TableMenuContextmenu, TableResizeBox, TableResizeScale, TableSelection, TableVirtualScrollbar, TableResizeLine } from 'quill-table-up';
import htmlEditButton from 'quill-html-edit-button';
import { forwardRef, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from 'react';
import  ImageResizor  from 'quill-image-resizor'
import { ImageDrop } from 'quill-image-drop-module';



ImageResizor.Quill = Quill
var Block: any = Quill.import('blots/block');
Block.tagName = 'div';
Quill.register(Block);
Quill.register({ [`modules/${TableUp.moduleName}`]: TableUp, "modules/htmlEditButton": htmlEditButton }, true);
Quill.register('modules/imageResizor', ImageResizor);
Quill.register('modules/imageDrop', ImageDrop);

var icons: any[] = Quill.import("ui/icons") as any[]



icons["undo" as any] = `
    <svg 
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#000000"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M3 7v6h6" />
  <path d="M21 17a9 9 0 00-9-9 9 9 0 00-6 2.3L3 13" />
</svg>
`
icons["redo" as any] = `
<svg 
  xmlns="http://www.w3.org/2000/svg"
  width="24"
  height="24"
  viewBox="0 0 24 24"
  fill="none"
  stroke="#000000"
  stroke-width="2"
  stroke-linecap="round"
  stroke-linejoin="round"
>
  <path d="M21 7v6h-6" />
  <path d="M3 17a9 9 0 019-9 9 9 0 016 2.3l3 2.7" />
</svg>
`

const QuillEditor = forwardRef(({ readOnly, value, onTextChange,discardChange,textDirection, onSelectionChange, onChange,...props }: {readOnly: boolean, value: any, onTextChange: any, discardChange: any, textDirection: string, onSelectionChange: any, onChange: any}, ref: any) => {
    const containerRef = useRef(null);
    const valueRef = useRef(value);
    const textDirectionRef = useRef(textDirection);
    const onTextChangeRef = useRef(onTextChange);
    const onSelectionChangeRef = useRef(onSelectionChange);
    const onChangeRef = useRef(onChange)
    const discardChangeRef = useRef(null)

    const [lastChange, setLastChange] = useState();

    useLayoutEffect(() => {
        onTextChangeRef.current = onTextChange;
        onSelectionChangeRef.current = onSelectionChange;
        onChangeRef.current = onChange
        discardChangeRef.current = discardChange
    });

    useEffect(() => {
        ref.current?.enable(!readOnly);
    }, [ref, readOnly]);

    useEffect(() => {
       if(ref.current) {
            ref.current.history.clear();
            ref.current.setContents(lastChange, 'silent');
        }
    }, [ref, discardChange]);

    const handleUndo = () => {
        if(ref.current) {
            ref.current.history.undo();
        }
    }

    const handleRedo = () => {
       if(ref.current) {
            ref.current.history.redo();
        }
    }


   
    


    const toolbarOptions = [
        [{ 'header': 1 }, { 'header': 2 }, { 'size': ['small', false, 'large', 'huge'] }, { 'header': [1, 2, 3, 4, 5, 6, false] }, { 'font': [] }, { 'align': [] }, { 'color': [] }, { 'background': [] }],
        ['bold', 'italic', 'underline', 'strike', 'blockquote', 'code-block', 'link', 'image', 'video', 'formula', "undo", "redo",'clean'], 
        [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }, { 'script': 'sub'}, { 'script': 'super' }],
        [{ 'indent': '-1'}, { 'indent': '+1' }, { 'direction': 'rtl' }],                  
        [{ [TableUp.toolName]: [] }],
    ];


    useEffect(() => {
        const container = containerRef.current!  as HTMLDivElement;
        const editorContainer = container.appendChild(container.ownerDocument.createElement('div'));

        const quill = new Quill(editorContainer, {
            theme: 'snow',
            modules: {
                imageResizor: {
                    modules: ['Resize', 'DisplaySize', 'Toolbar'],
                    handleStyles: {
                        backgroundColor: 'black',
                        border: 'none',
                        color: 'white',
                        
                        // other camelCase styles for size display
                    }
                },
                imageDrop: true,
                toolbar: {
                    container: toolbarOptions,
                    handlers: {
                        'undo': handleUndo,
                        'redo': handleRedo
                    }
                },
                history: {
                    delay: 1000,
                    maxStack: 500,
                    userOnly: true
                },
                 htmlEditButton: {
                    syntax: true,
                    buttonHTML: `
                        <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
                             viewBox="0 0 27.17 27.17" xml:space="preserve"
                            >
                        <g>
                            <path d="M1.609,0.008c0.013,0.129,0.023,0.248,0.033,0.367c0.103,1.153,0.203,2.307,0.307,3.459
                                c0.132,1.465,0.265,2.933,0.395,4.397c0.11,1.232,0.219,2.467,0.328,3.7c0.124,1.389,0.249,2.777,0.373,4.167
                                c0.109,1.231,0.218,2.467,0.328,3.7c0.134,1.502,0.27,3.002,0.398,4.504c0.008,0.097,0.039,0.138,0.135,0.164
                                c3.177,0.896,6.352,1.793,9.525,2.687c0.08,0.022,0.176,0.021,0.256,0c3.187-0.894,6.373-1.789,9.56-2.682
                                c0.109-0.031,0.143-0.078,0.15-0.185c0.068-0.837,0.146-1.673,0.219-2.509c0.082-0.922,0.166-1.846,0.248-2.77
                                c0.074-0.826,0.146-1.65,0.221-2.477c0.084-0.924,0.166-1.848,0.248-2.771c0.072-0.825,0.146-1.649,0.221-2.476
                                c0.082-0.92,0.164-1.84,0.246-2.76c0.074-0.828,0.146-1.656,0.223-2.486c0.082-0.92,0.164-1.84,0.246-2.76
                                c0.074-0.838,0.148-1.678,0.227-2.517C25.517,0.51,25.538,0.258,25.562,0C17.571,0.008,9.6,0.008,1.609,0.008z M20.831,7.965
                                c-3.82,0-7.638,0-11.47,0c0.09,1.033,0.179,2.056,0.267,3.082c3.649,0,7.287,0,10.938,0c-0.027,0.217-0.061,0.422-0.08,0.629
                                c-0.051,0.521-0.1,1.043-0.146,1.562c-0.084,0.943-0.166,1.892-0.248,2.835c-0.072,0.848-0.145,1.691-0.221,2.539
                                c-0.047,0.535-0.1,1.07-0.145,1.604c-0.008,0.084-0.062,0.086-0.111,0.101c-1.293,0.356-2.584,0.713-3.877,1.067
                                c-0.709,0.197-1.417,0.396-2.127,0.591c-0.032,0.01-0.076,0.004-0.11-0.007c-2.006-0.551-4.011-1.104-6.015-1.653
                                c-0.092-0.023-0.094-0.08-0.1-0.146c-0.051-0.644-0.102-1.283-0.15-1.927c-0.067-0.864-0.135-1.729-0.203-2.594
                                c-0.002-0.022-0.002-0.049-0.004-0.08c0.99,0,1.978,0,2.971,0c0.025,0.281,0.052,0.562,0.076,0.838
                                c0.044,0.49,0.088,0.979,0.13,1.472c0.004,0.056,0.021,0.078,0.075,0.094c1.076,0.287,2.15,0.578,3.228,0.867
                                c0.038,0.011,0.084,0.006,0.123-0.004c1.062-0.285,2.123-0.574,3.187-0.856c0.064-0.019,0.092-0.048,0.098-0.113
                                c0.117-1.254,0.236-2.51,0.357-3.763c0-0.004-0.002-0.009-0.004-0.023c-3.463,0-6.928,0-10.401,0C6.596,11.049,6.326,8.029,6.055,5
                                c5.025,0,10.028,0,15.057,0C21.021,5.988,20.925,6.971,20.831,7.965z"/>
                        </g>
                        </svg>
                    `
                 },
                [TableUp.moduleName]: {
                    customSelect: defaultCustomSelect,
                    modules: [
                        { module: TableVirtualScrollbar },
                        { module: TableAlign },
                        { module: TableResizeLine },
                        { module: TableResizeScale },
                        { module: TableSelection },
                        { module: TableMenuContextmenu, },
                        { module: TableResizeBox, },
                    ],
                }
            }
        });

        ref.current = quill;



        if (valueRef.current) {
            const htmlSrcToDelta = ref.current.clipboard.convert({html: valueRef.current}) 
            quill.setContents(htmlSrcToDelta, 'silent');
            setLastChange(htmlSrcToDelta)
        }  


        if(textDirectionRef.current) {
            if (textDirectionRef.current ===  'rtl') {
                quill.format('direction', 'rtl')
                quill.format('align', 'right');
            } else {
                quill.format('direction', 'ltr')
                quill.format('align', 'left');
            }  
        }
        
        quill.on(Quill.events.TEXT_CHANGE, (...args) => {
            onTextChangeRef.current?.(...args);
            onChangeRef.current?.(quill.root.innerHTML)            
        });

        quill.on(Quill.events.SELECTION_CHANGE, (...args) => {
            onSelectionChangeRef.current?.(...args);
        });

        return () => {
            ref.current = null;
            container.innerHTML = '';
        };
    }, [ref, valueRef]);


    return <div ref={containerRef}></div>;
});

QuillEditor.displayName = 'Editor';

export default QuillEditor;
