type LoaderProps = {
  size?: "sm" | "md" | "lg";
  fullScreen?: boolean;
  text?: string;
};

export default function Loader({
  size = "md",
  fullScreen = false,
  text,
}: LoaderProps) {
  const sizeClasses = {
    sm: "w-4 h-4 border-2",
    md: "w-8 h-8 border-4",
    lg: "w-12 h-12 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center gap-3">
      <div
        className={`${sizeClasses[size]} border-gray-300 border-t-blue-500 rounded-full animate-spin`}
      />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
        {spinner}
      </div>
    );
  }

  return spinner;
}
