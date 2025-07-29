import { Clock } from "lucide-react";
import React from "react";

interface IVersionIndicatorProps {
  currentVersion: number;
  totalVersions: number;
  maxVersions: number;
}

export const VersionIndicator: React.FC<IVersionIndicatorProps> = ({
  currentVersion,
  totalVersions,
  maxVersions,
}) => {
  const getVersionColor = () => {
    const percentage = (totalVersions / maxVersions) * 100;
    if (percentage >= 90) return "text-red-600";
    if (percentage >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  return (
    <div className="flex items-center gap-2 text-sm">
      <Clock className="h-4 w-4 text-gray-500" />
      <span className="text-gray-600">Version {currentVersion}</span>
      <span className={`${getVersionColor()}`}>
        ({totalVersions}/{maxVersions} versions)
      </span>
      {totalVersions >= maxVersions * 0.9 && (
        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
          Limite atteinte
        </span>
      )}
    </div>
  );
};
