interface TestimonialAvatarProps {
  name: string;
  color: string;
}

export default function TestimonialAvatar({ name, color }: TestimonialAvatarProps) {
  const initials = name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase();

  return (
    <div
      className="h-10 w-10 rounded-full flex items-center justify-center text-white font-semibold"
      style={{ backgroundColor: color }}
    >
      {initials}
    </div>
  );
} 