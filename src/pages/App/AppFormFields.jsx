import React from 'react';
import IconPicker from '../../components/IconPicker';
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import SwitchComponent from '@/components/SwitchComponent';
import IconSelector from './IconSelector';

export const AppFormFields = ({ mode, appState, setAppState }) => {
  const { name, icon, settings } = appState;
  const { setupType, viewType, content, autoSize } = settings;

  const handleIconSelect = icon => {
 
    setAppState({ ...appState, icon });
  };

  const handleInputChange = e => {
    setAppState({ ...appState, [e.target.name]: e.target.value });
  };



  const handleSettingsChange = (field, value) => {
    console.log({
      field, value
    })
    setAppState({
      ...appState,
      settings: {
        ...appState.settings,
        [field]: value,
      },
    });
  };
  
 
  return (
    <div className="">
 
      <div className="my-4 space-y-2">
        <Label htmlFor="name" className="text-sm font-medium">
          Name - How it should appear in the sidebar
        </Label>
        <Input
          id="name"
          name="name"
          value={name}
          onChange={handleInputChange}
          required
        />
      </div>

      <div>
      <Label className="text-sm font-medium mb-2">
          Select sidebar icon
        </Label>
      <IconSelector initialIconName={appState.icon}  onSelectIcon={handleIconSelect}  />
      </div>

      {mode !== 'edit' && (
        <div className="my-4 space-y-2">
          <Label className="text-sm font-medium">
            Select setup type
          </Label>
          <Select
            value={setupType === 'automatic' ? 'automatic' : 'manual'}
            onValueChange={(value) => {
              handleSettingsChange('setupType', value);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select setup type" />
            </SelectTrigger>
            <SelectContent className='bg-white'>
            <SelectItem
  className="cursor-pointer transition-colors duration-200 hover:bg-neutral-800 hover:text-white"
  value="automatic"
>
  Automatic — All clients see the same content
</SelectItem>


              <SelectItem   className="cursor-pointer transition-colors duration-200 hover:bg-neutral-800 hover:text-white"
 value="manual">
                Manual — Manually connect content for each client
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}


      {setupType !== 'manual' && (
        <>


{/* Connet input */}


<div className="my-4 space-y-2">
  <Label className="text-sm font-medium">
    Connection type
  </Label>
  <RadioGroup
    value={viewType}
    onValueChange={(value) => handleSettingsChange('viewType', value)}
    className="space-y-2"
  >
    {/* Option 1: Embedded */}
    <Label 
      htmlFor="embedded" 
      className="flex items-start space-x-2 p-3 rounded-md border cursor-pointer hover:bg-gray-50"
    >
      <RadioGroupItem
        value="embedded"
        id="embedded"
        className="h-5 w-5 border-2 border-black rounded-full data-[state=checked]:bg-black 
                   data-[state=checked]:after:content-[''] data-[state=checked]:after:block 
                   data-[state=checked]:after:w-2.5 data-[state=checked]:after:h-2.5 
                   data-[state=checked]:after:rounded-full data-[state=checked]:after:bg-white 
                   data-[state=checked]:after:mx-auto data-[state=checked]:after:my-auto 
                   relative after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
      />
      <div className="grid gap-1.5 leading-none">
        <span className="font-medium">
          Connected as embedded content
        </span>
        <p className="text-sm text-gray-500">
          Shows directly into the portal
        </p>
      </div>
    </Label>

    {/* Option 2: Link */}
    <Label 
      htmlFor="link" 
      className="flex items-start space-x-2 p-3 rounded-md border cursor-pointer hover:bg-gray-50"
    >
      <RadioGroupItem
        value="link"
        id="link"
        className="h-5 w-5 cursor-pointer border-2 border-black rounded-full data-[state=checked]:bg-black 
                   data-[state=checked]:after:content-[''] data-[state=checked]:after:block 
                   data-[state=checked]:after:w-2.5 data-[state=checked]:after:h-2.5 
                   data-[state=checked]:after:rounded-full data-[state=checked]:after:bg-white 
                   data-[state=checked]:after:mx-auto data-[state=checked]:after:my-auto 
                   relative after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2"
      />
      <div className="grid gap-1.5 leading-none">
        <span className="font-medium">
          Connected as link
        </span>
        <p className="text-sm text-gray-500">
          App opens in a new browser tab
        </p>
      </div>
    </Label>
  </RadioGroup>
</div>
          {viewType === 'embedded' && (
            <div className="flex items-center gap-2 my-4">
 
              <SwitchComponent 
                id="auto-size"
                enabled={autoSize}
                setEnabled={(value) => handleSettingsChange('autoSize', value)}
                label="Auto size"
              />
            </div>
          )}
                    <div className="my-4 space-y-2">
            <Label htmlFor="content" className="text-sm font-medium">
              Content - can be public url
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => handleSettingsChange('content', e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </>



      )}
    </div>
  );
};