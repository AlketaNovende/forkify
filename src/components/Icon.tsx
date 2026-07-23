import icons from '../img/icons.svg';

export type IconName =
  | 'alert-triangle'
  | 'arrow-left'
  | 'arrow-right'
  | 'bookmark'
  | 'bookmark-fill'
  | 'check'
  | 'clock'
  | 'edit'
  | 'loader'
  | 'minus-circle'
  | 'plus-circle'
  | 'search'
  | 'smile'
  | 'upload-cloud'
  | 'user'
  | 'users';

interface IconProps {
  name: IconName;
  className?: string;
}

export default function Icon({ name, className }: IconProps) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <use href={`${icons}#icon-${name}`} />
    </svg>
  );
}
