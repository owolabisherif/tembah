import { cn } from "@/lib/utils";
import { UploadIcon } from "lucide-react";
import { CSSProperties, forwardRef, RefObject, useEffect, useImperativeHandle, useLayoutEffect, useRef, useState } from "react";
import Dropzone, { DropzoneState,  } from 'shadcn-dropzone';

type DropzonePropType = {
  value: string | File[]
  className?: string
  onChange: any
  acceptedFilesType: {
    [key: string]: readonly string[]
  }
  onDragMessage: string
  allowMultiple: boolean
}

const DropZone = forwardRef(({value, onChange, className,acceptedFilesType,onDragMessage, allowMultiple, ...props}:  DropzonePropType, ref: any) => {
    const valueRef = useRef<string | File[]>(null)
    const [preview, setPreview] = useState<string | null>(null)
    const onChangeRef = useRef(onChange)
    const [blankMessage, setBlankMessage] = useState<string>("")
    const onDragMessageRef = useRef(onDragMessage)
    const allowMultipleRef = useRef(allowMultiple)
    const acceptedFilesTypeRef = useRef(acceptedFilesType)

    useLayoutEffect(() => {
      valueRef.current = value
      onChangeRef.current = onChange
    })

    useImperativeHandle(ref, () => ({
      reset: () => setPreview(null),
      getPreview: (file: File) => getPreview([file])
    }))

    useEffect(() => {
      let fileTypes = Object.keys(acceptedFilesTypeRef.current)
      if(fileTypes.length > 1) {
        setBlankMessage(allowMultipleRef.current ? 'files' : 'file')
      } else {
        let type = fileTypes[0].split('/')[0]
        setBlankMessage(allowMultipleRef.current ?  type+'s' : type)
      }
    }, [acceptedFilesType])

    useEffect(() => {
      if(valueRef.current instanceof File) {
        getPreview([valueRef.current])
      } else {
        convertToImageFile()
      }
    }, [valueRef])

    const convertToImageFile = async() => {
      if(valueRef.current && typeof valueRef.current == 'string') {
        if(valueRef.current == "") return

        setPreview(valueRef.current)

        try {
            const res = await fetch(valueRef.current)
            const blob = await res.blob()

            let fileNameArray = valueRef.current?.toString().split('/')
            let fileName = fileNameArray && fileNameArray.length ? fileNameArray[fileNameArray.length - 1] : ''
            let file = new File([blob], `${fileName}`, {type: blob.type})


            onChangeRef.current?.(file)
        } catch (error) {
          console.error("An error occured: ", error)
        }
      }
    }

    const getPreview = (files: File[]) => {

      const imgUrl = URL.createObjectURL(files[0])
      onChangeRef.current?.(files[0])
      setPreview(imgUrl)
    }


    const styles: CSSProperties ={
      backgroundImage: `${preview ? `url(${preview})` : ''}`,
      backgroundSize: 'contain',
      backgroundPosition: "center",
      backgroundRepeat: 'no-repeat'
    }

    return (
    <Dropzone
      multiple={allowMultipleRef.current}
      accept={acceptedFilesTypeRef.current}
      noDrag={false}
      showFilesList={true}
      onDrop={(acceptedFiles: File[]) => {
        getPreview(acceptedFiles)
      }}
      dropZoneClassName={cn(className, `overflow-hidden`)}
      containerClassName="h-full overflow-hidden"
    >
      {(dropzone: DropzoneState) => (
        <div className='flex justify-center items-center w-full h-full text-xs font-bold gap-x-2 relative' style={styles}>
          {
              blankMessage == 'video' && preview && <video src={preview} className="absolute left-0 right-0 bottom-0 top-0 object-contain object-center z-10"></video>
           }
          {
            
            dropzone.isDragAccept ? (
              
                <div className="flex px-2 py-1 text-white bg-green-300 justify-center items-center gap-x-2 rounded-full bg-center z-50">
                  <UploadIcon className="w-4" />
                  <p>{onDragMessageRef.current}</p>
                </div>
            ) : (
                dropzone.acceptedFiles.length ? <div className="flex px-2 py-2 text-white bg-gray-500 justify-center items-center gap-x-2 rounded-full z-50">
                  <p>{dropzone.acceptedFiles.length} {blankMessage} uploaded.</p>
                </div> :<div className="flex px-2 py-1 text-white bg-gray-500 justify-center items-center gap-x-2 rounded-full z-50">
                  <UploadIcon className="w-4" />
                  <p>{preview ? 'Replace' : 'Upload'} {blankMessage}</p>
                </div>
            )
          }
        </div>
      )}
    </Dropzone>
  )
})




DropZone.displayName = 'DropZoneComponent'

export default DropZone