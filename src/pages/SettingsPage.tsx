import React, { useState } from 'react';
import { EscalationConfig, EdgeDeviceInfo } from '../types';
import {
  Settings,
  Clock,
  Building,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Save,
  Cpu,
  Layers,
  FileText
} from 'lucide-react';

interface SettingsPageProps {
  config: EscalationConfig;
  onSaveConfig: (config: EscalationConfig) => void;
  edgeInfo: EdgeDeviceInfo;
  onResetDemoData: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  config,
  onSaveConfig,
  edgeInfo,
  onResetDemoData
}) => {
  const [criticalHours, setCriticalHours] = useState(config.criticalTargetHours);
  const [highHours, setHighHours] = useState(config.highTargetHours);
  const [mediumHours, setMediumHours] = useState(config.mediumTargetHours);
  const [lowHours, setLowHours] = useState(config.lowTargetHours);
  const [clusterThreshold, setClusterThreshold] = useState(config.clusterThresholdCount);
  const [inAppAlerts, setInAppAlerts] = useState(config.inAppAlertsEnabled);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig({
      ...config,
      criticalTargetHours: Number(criticalHours),
      highTargetHours: Number(highHours),
      mediumTargetHours: Number(mediumHours),
      lowTargetHours: Number(lowHours),
      clusterThresholdCount: Number(clusterThreshold),
      inAppAlertsEnabled: inAppAlerts
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const categories = [
    'Academic',
    'Faculty',
    'Infrastructure',
    'Examination',
    'Attendance',
    'Fees',
    'Hostel',
    'Administration'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Settings Header */}
      <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs flex items-center justify-between">
        <div>
          <h2 className="text-base font-bold text-[#20242B] flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#244A73]" />
            System Administration & Policy Settings
          </h2>
          <p className="text-xs text-[#697386]">
            Configure operational service-level agreement (SLA) targets, escalation policies, and inference parameters.
          </p>
        </div>

        {savedSuccess && (
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded text-xs font-semibold flex items-center gap-1.5 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            Settings Saved
          </span>
        )}
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: SLA Target Hours */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-[#E5E7EB] pb-2">
            <h3 className="text-sm font-bold text-[#20242B] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#244A73]" />
              Response Time Targets (SLA Hours)
            </h3>
            <p className="text-xs text-[#697386]">
              Set institutional turnaround expectations for each priority tier.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-red-700 uppercase mb-1">
                Critical SLA (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={48}
                value={criticalHours}
                onChange={e => setCriticalHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded text-xs font-mono font-bold text-[#20242B] focus:bg-white focus:border-[#244A73]"
              />
              <span className="text-[11px] text-[#697386] mt-1 block">Default: 4 hours</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-amber-700 uppercase mb-1">
                High Priority SLA (Hours)
              </label>
              <input
                type="number"
                min={2}
                max={72}
                value={highHours}
                onChange={e => setHighHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded text-xs font-mono font-bold text-[#20242B] focus:bg-white focus:border-[#244A73]"
              />
              <span className="text-[11px] text-[#697386] mt-1 block">Default: 24 hours</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-yellow-700 uppercase mb-1">
                Medium Priority SLA (Hours)
              </label>
              <input
                type="number"
                min={4}
                max={120}
                value={mediumHours}
                onChange={e => setMediumHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded text-xs font-mono font-bold text-[#20242B] focus:bg-white focus:border-[#244A73]"
              />
              <span className="text-[11px] text-[#697386] mt-1 block">Default: 48 hours</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">
                Low Priority SLA (Hours)
              </label>
              <input
                type="number"
                min={12}
                max={240}
                value={lowHours}
                onChange={e => setLowHours(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded text-xs font-mono font-bold text-[#20242B] focus:bg-white focus:border-[#244A73]"
              />
              <span className="text-[11px] text-[#697386] mt-1 block">Default: 72 hours</span>
            </div>
          </div>
        </div>

        {/* Section 2: Escalation & Clustering Rules */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs space-y-4">
          <div className="border-b border-[#E5E7EB] pb-2">
            <h3 className="text-sm font-bold text-[#20242B] flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#244A73]" />
              Automated Duplicate Clustering & Alerts
            </h3>
            <p className="text-xs text-[#697386]">
              Define threshold triggers for grouping recurring complaints across cohorts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-xs font-semibold text-[#20242B] uppercase mb-1">
                Cluster Formation Threshold (Reports)
              </label>
              <input
                type="number"
                min={2}
                max={10}
                value={clusterThreshold}
                onChange={e => setClusterThreshold(Number(e.target.value))}
                className="w-full px-3 py-2 bg-[#F7F8FA] border border-[#E5E7EB] rounded text-xs font-mono font-bold text-[#20242B] focus:bg-white focus:border-[#244A73]"
              />
              <span className="text-[11px] text-[#697386] mt-1 block">
                Automatically group issues when 3 or more similar keyword descriptions appear.
              </span>
            </div>

            <div className="flex flex-col justify-center">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={inAppAlerts}
                  onChange={e => setInAppAlerts(e.target.checked)}
                  className="w-4 h-4 rounded text-[#244A73] border-gray-300 focus:ring-[#244A73]"
                />
                <span className="text-xs font-semibold text-[#20242B]">
                  Enable Real-Time In-App Critical Alerts Banner
                </span>
              </label>
              <span className="text-[11px] text-[#697386] mt-1 ml-6">
                Notifies administrative officers immediately when safety or critical items are ingested.
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Active Supported Categories */}
        <div className="bg-white border border-[#E5E7EB] rounded-lg p-5 shadow-xs space-y-3">
          <div className="border-b border-[#E5E7EB] pb-2">
            <h3 className="text-sm font-bold text-[#20242B] flex items-center gap-2">
              <Building className="w-4 h-4 text-[#244A73]" />
              Active Institutional Feedback Taxonomy
            </h3>
            <p className="text-xs text-[#697386]">
              All 8 core university categories supported by the Edge DistilBERT classifier.
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {categories.map(cat => (
              <span
                key={cat}
                className="px-3 py-1.5 bg-[#F7F8FA] border border-[#E5E7EB] rounded-md text-[#20242B] font-semibold flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                {cat}
              </span>
            ))}
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#244A73] hover:bg-[#1B3756] text-white text-xs font-semibold rounded-md transition-colors shadow-xs"
          >
            <Save className="w-4 h-4" />
            Save SLA & Escalation Settings
          </button>
        </div>
      </form>

      {/* Section 4: Demo Data & Reset Controls */}
      <div className="bg-white border border-red-200 rounded-lg p-5 shadow-xs space-y-3">
        <div className="border-b border-gray-200 pb-2 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-red-700 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-red-600" />
              Demo Dataset Management
            </h3>
            <p className="text-xs text-[#697386]">
              Reset stored feedback back to the standardized 30-item evaluation dataset.
            </p>
          </div>
        </div>

        {!showResetConfirm ? (
          <button
            type="button"
            onClick={() => setShowResetConfirm(true)}
            className="px-3.5 py-2 border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset to Standard Demo Dataset
          </button>
        ) : (
          <div className="p-3 bg-red-50 border border-red-300 rounded-md space-y-2 text-xs">
            <div className="font-bold text-red-800">
              Confirm Demo Data Reset?
            </div>
            <p className="text-red-700">
              This will restore the 30 initial sample feedback records spanning all 8 categories and reset edge telemetry counters.
            </p>
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  onResetDemoData();
                  setShowResetConfirm(false);
                }}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded font-medium"
              >
                Yes, Reset Data
              </button>
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 border border-gray-300 bg-white text-gray-700 rounded hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
