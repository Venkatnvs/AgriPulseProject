import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, GlobeIcon } from 'lucide-react';
import { availableLanguages } from '@/constants/Languages';
import flags from 'react-phone-number-input/flags';

const FlagComponent = ({ country, countryName }) => {
  const Flag = flags[country];

  return (
    <span className='bg-foreground/20 flex h-4 w-6 overflow-hidden rounded-sm'>
      {Flag && <Flag title={countryName} />}
    </span>
  );
};

export default function LanguageSelector({selectLanguage, selectedLanguage}) { 
  const [, setRender] = useState({});

  useEffect(() => {
    setRender({});
  }, [selectedLanguage]);

  const currentLanguage = availableLanguages.find(lang => lang.code === selectedLanguage);

  return (
    <div className="fixed top-[50px] md:top-[18px] right-0 transform translate-x-0 translate-y-[50%] z-50"> {/* Ensure higher z-index */}
      <div className="group relative w-[40px] h-[40px]">
        <DropdownMenu style={{ translate: 'none' }} translate="no" className="notranslate">
          <DropdownMenuTrigger asChild style={{ translate: 'none' }} translate="no" className="notranslate">
            <Button
              variant="outline"
              size="sm"
              className="shadow-sm h-full w-full cursor-pointer p-1 md:h-full md:w-full relative z-40 border border-primary border-r-0 rounded-l-full"
              key={selectedLanguage}
            >
              <GlobeIcon className="h-5 w-5 text-foreground" />
              <span className="ml-1 text-foreground group-hover:block hidden">
                {currentLanguage?.code || 'EN'}
              </span>
              <span className="sr-only">Select Language</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[160px] notranslate" style={{ translate: 'none' }} translate="no">
            {availableLanguages.map((lang) => (
              <DropdownMenuItem
                key={lang.code}
                onClick={() => selectLanguage(lang.code)}
                className="flex items-center justify-start gap-2"
              >
                <FlagComponent country={lang.countryCode} countryName={lang.name} />
                <span>{lang.name}</span>
                {lang.code === selectedLanguage && (
                  <Check className="h-4 w-4 text-primary" />
                )}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
