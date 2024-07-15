import WithProviders from './WithProviders';
import * as Pages from '../features'; // Assuming all pages are in this directory

// Wrap each Pages with providers and export it

export * from './download';
export * from './plan';

export const ActivityCategoryMasterPage = () => (
  <WithProviders>
    <Pages.ActivityCategoryMasterPage />
  </WithProviders>
);

export const ActivityPlanMasterPage = () => (
  <WithProviders>
    <Pages.ActivityPlanMasterPage />
  </WithProviders>
);

export const AuthPage = () => (
  <WithProviders>
    <Pages.AuthPage />
  </WithProviders>
);

export const BlockPage = () => (
  <WithProviders>
    <Pages.BlockPage />
  </WithProviders>
);

export const CompanyPage = () => (
  <WithProviders>
    <Pages.CompanyPage />
  </WithProviders>
);

export const CompanyTypePage = () => (
  <WithProviders>
    <Pages.CompanyTypePage />
  </WithProviders>
);

export const CreateActivityPlanMasterPage = () => (
  <WithProviders>
    <Pages.CreateActivityPlanMasterPage />
  </WithProviders>
);

export const CreateBlockMasterPage = () => (
  <WithProviders>
    <Pages.CreateBlockMasterPage />
  </WithProviders>
);

export const CreateBlockPitMasterPage = () => (
  <WithProviders>
    <Pages.CreateBlockPitMasterPage />
  </WithProviders>
);

export const CreateCalculationCategoryPage = () => (
  <WithProviders>
    <Pages.CreateCalculationCategoryPage />
  </WithProviders>
);

export const CreateCompanyHeavyEquipmentPage = () => (
  <WithProviders>
    <Pages.CreateCompanyHeavyEquipmentPage />
  </WithProviders>
);

export const CreateCompanyHumanResourcesPage = () => (
  <WithProviders>
    <Pages.CreateCompanyHumanResourcesPage />
  </WithProviders>
);

export const CreateCompanyPage = () => (
  <WithProviders>
    <Pages.CreateCompanyPage />
  </WithProviders>
);

export const CreateElementMasterPage = () => (
  <WithProviders>
    <Pages.CreateElementMasterPage />
  </WithProviders>
);

export const CreateFactoryMasterPage = () => (
  <WithProviders>
    <Pages.CreateFactoryMasterPage />
  </WithProviders>
);

export const CreateFrontProductionPage = () => (
  <WithProviders>
    <Pages.CreateFrontProductionPage />
  </WithProviders>
);

export const CreateHeavyEquipmentAvailablePage = () => (
  <WithProviders>
    <Pages.CreateHeavyEquipmentAvailablePage />
  </WithProviders>
);

export const CreateHeavyEquipmentClassPage = () => (
  <WithProviders>
    <Pages.CreateHeavyEquipmentClassPage />
  </WithProviders>
);

export const CreateHeavyEquipmentMasterPage = () => (
  <WithProviders>
    <Pages.CreateHeavyEquipmentMasterPage />
  </WithProviders>
);

export const CreateHeavyEquipmentPage = () => (
  <WithProviders>
    <Pages.CreateHeavyEquipmentPage />
  </WithProviders>
);

export const CreateHeavyEquipmentProductionPage = () => (
  <WithProviders>
    <Pages.CreateHeavyEquipmentProductionPage />
  </WithProviders>
);

export const CreateHumanResourcesAvailablePage = () => (
  <WithProviders>
    <Pages.CreateHumanResourcesAvailablePage />
  </WithProviders>
);

export const CreateHumanResourcesPage = () => (
  <WithProviders>
    <Pages.CreateHumanResourcesPage />
  </WithProviders>
);

export const CreateLocationMasterPage = () => (
  <WithProviders>
    <Pages.CreateLocationMasterPage />
  </WithProviders>
);

export const CreateMaterialMasterPage = () => (
  <WithProviders>
    <Pages.CreateMaterialMasterPage />
  </WithProviders>
);

export const CreateRitageBargingPage = () => (
  <WithProviders>
    <Pages.CreateRitageBargingPage />
  </WithProviders>
);

export const CreateRitageMovingPage = () => (
  <WithProviders>
    <Pages.CreateRitageMovingPage />
  </WithProviders>
);

export const CreateRitageObPage = () => (
  <WithProviders>
    <Pages.CreateRitageObPage />
  </WithProviders>
);

export const CreateRitageOrePage = () => (
  <WithProviders>
    <Pages.CreateRitageOrePage />
  </WithProviders>
);

export const CreateRitageQuarryPage = () => (
  <WithProviders>
    <Pages.CreateRitageQuarryPage />
  </WithProviders>
);

export const CreateRitageTopsoilPage = () => (
  <WithProviders>
    <Pages.CreateRitageTopsoilPage />
  </WithProviders>
);

export const CreateShiftMasterPage = () => (
  <WithProviders>
    <Pages.CreateShiftMasterPage />
  </WithProviders>
);

export const CreateShippingMonitoringPage = () => (
  <WithProviders>
    <Pages.CreateShippingMonitoringPage />
  </WithProviders>
);

export const CreateSmapleHouseLabPage = () => (
  <WithProviders>
    <Pages.CreateSmapleHouseLabPage />
  </WithProviders>
);

export const CreateStockpileDomeMasterPage = () => (
  <WithProviders>
    <Pages.CreateStockpileDomeMasterPage />
  </WithProviders>
);

export const CreateStockpileMasterPage = () => (
  <WithProviders>
    <Pages.CreateStockpileMasterPage />
  </WithProviders>
);

export const CreateWeatherProductionPage = () => (
  <WithProviders>
    <Pages.CreateWeatherProductionPage />
  </WithProviders>
);

export const CreateWorkingHoursPlanMasterPage = () => (
  <WithProviders>
    <Pages.CreateWorkingHoursPlanMasterPage />
  </WithProviders>
);

export const DashboardPage = () => (
  <WithProviders>
    <Pages.DashboardPage />
  </WithProviders>
);

export const DataRitagePage = () => (
  <WithProviders>
    <Pages.DataRitagePage />
  </WithProviders>
);

export const ElementMasterPage = () => (
  <WithProviders>
    <Pages.ElementMasterPage />
  </WithProviders>
);

export const FactoryMasterPage = () => (
  <WithProviders>
    <Pages.FactoryMasterPage />
  </WithProviders>
);

export const FrontProductionPage = () => (
  <WithProviders>
    <Pages.FrontProductionPage />
  </WithProviders>
);

export const HeavyEquipmentClassPage = () => (
  <WithProviders>
    <Pages.HeavyEquipmentClassPage />
  </WithProviders>
);

export const HeavyEquipmentMasterPage = () => (
  <WithProviders>
    <Pages.HeavyEquipmentMasterPage />
  </WithProviders>
);

export const HeavyEquipmentPage = () => (
  <WithProviders>
    <Pages.HeavyEquipmentPage />
  </WithProviders>
);

export const HeavyEquipmentProductionPage = () => (
  <WithProviders>
    <Pages.HeavyEquipmentProductionPage />
  </WithProviders>
);

export const HumanResourcesPage = () => (
  <WithProviders>
    <Pages.HumanResourcesPage />
  </WithProviders>
);

export const LocationPage = () => (
  <WithProviders>
    <Pages.LocationPage />
  </WithProviders>
);

export const MaterialMasterPage = () => (
  <WithProviders>
    <Pages.MaterialMasterPage />
  </WithProviders>
);

export const ProfilePage = () => (
  <WithProviders>
    <Pages.ProfilePage />
  </WithProviders>
);

export const ReadActivityPlanPage = () => (
  <WithProviders>
    <Pages.ReadActivityPlanPage />
  </WithProviders>
);

export const ReadBlockMasterPage = () => (
  <WithProviders>
    <Pages.ReadBlockMasterPage />
  </WithProviders>
);

export const ReadCalculationCategoryPage = () => (
  <WithProviders>
    <Pages.ReadCalculationCategoryPage />
  </WithProviders>
);

export const ReadCompanyHeavyEquipmentPage = () => (
  <WithProviders>
    <Pages.ReadCompanyHeavyEquipmentPage />
  </WithProviders>
);

export const ReadCompanyHumanResourcesPage = () => (
  <WithProviders>
    <Pages.ReadCompanyHumanResourcesPage />
  </WithProviders>
);

export const ReadCompanyPage = () => (
  <WithProviders>
    <Pages.ReadCompanyPage />
  </WithProviders>
);

export const ReadDTBargingRitagePage = () => (
  <WithProviders>
    <Pages.ReadDTBargingRitagePage />
  </WithProviders>
);

export const ReadDTMovingRitagePage = () => (
  <WithProviders>
    <Pages.ReadDTMovingRitagePage />
  </WithProviders>
);

export const ReadDTObRitagePage = () => (
  <WithProviders>
    <Pages.ReadDTObRitagePage />
  </WithProviders>
);

export const ReadDTOreRitagePage = () => (
  <WithProviders>
    <Pages.ReadDTOreRitagePage />
  </WithProviders>
);

export const ReadDTQuarryRitagePage = () => (
  <WithProviders>
    <Pages.ReadDTQuarryRitagePage />
  </WithProviders>
);

export const ReadDTTopsoilRitagePage = () => (
  <WithProviders>
    <Pages.ReadDTTopsoilRitagePage />
  </WithProviders>
);

export const ReadElementMasterPage = () => (
  <WithProviders>
    <Pages.ReadElementMasterPage />
  </WithProviders>
);

export const ReadFactoryMasterPage = () => (
  <WithProviders>
    <Pages.ReadFactoryMasterPage />
  </WithProviders>
);

export const ReadFrontProductionPage = () => (
  <WithProviders>
    <Pages.ReadFrontProductionPage />
  </WithProviders>
);

export const ReadHeavyEquipmentClassPage = () => (
  <WithProviders>
    <Pages.ReadHeavyEquipmentClassPage />
  </WithProviders>
);

export const ReadHeavyEquipmentFormulaPage = () => (
  <WithProviders>
    <Pages.ReadHeavyEquipmentFormulaPage />
  </WithProviders>
);

export const ReadHeavyEquipmentMasterPage = () => (
  <WithProviders>
    <Pages.ReadHeavyEquipmentMasterPage />
  </WithProviders>
);

export const ReadHeavyEquipmentPage = () => (
  <WithProviders>
    <Pages.ReadHeavyEquipmentPage />
  </WithProviders>
);

export const ReadHeavyEquipmentProductionPage = () => (
  <WithProviders>
    <Pages.ReadHeavyEquipmentProductionPage />
  </WithProviders>
);

export const ReadHumanResourcesPage = () => (
  <WithProviders>
    <Pages.ReadHumanResourcesPage />
  </WithProviders>
);

export const ReadLocationMasterPage = () => (
  <WithProviders>
    <Pages.ReadLocationMasterPage />
  </WithProviders>
);

export const ReadLoseTimeCategoryPage = () => (
  <WithProviders>
    <Pages.ReadLoseTimeCategoryPage />
  </WithProviders>
);

export const ReadMaterialMasterPage = () => (
  <WithProviders>
    <Pages.ReadMaterialMasterPage />
  </WithProviders>
);

export const ReadRitageBargingPage = () => (
  <WithProviders>
    <Pages.ReadRitageBargingPage />
  </WithProviders>
);

export const ReadRitageMovingPage = () => (
  <WithProviders>
    <Pages.ReadRitageMovingPage />
  </WithProviders>
);

export const ReadRitageObPage = () => (
  <WithProviders>
    <Pages.ReadRitageObPage />
  </WithProviders>
);

export const ReadRitageOrePage = () => (
  <WithProviders>
    <Pages.ReadRitageOrePage />
  </WithProviders>
);

export const ReadRitageQuarryPage = () => (
  <WithProviders>
    <Pages.ReadRitageQuarryPage />
  </WithProviders>
);

export const ReadRitageTopsoilPage = () => (
  <WithProviders>
    <Pages.ReadRitageTopsoilPage />
  </WithProviders>
);

export const ReadSampleHouseLabPage = () => (
  <WithProviders>
    <Pages.ReadSampleHouseLabPage />
  </WithProviders>
);

export const ReadShiftMasterPage = () => (
  <WithProviders>
    <Pages.ReadShiftMasterPage />
  </WithProviders>
);

export const ReadShippingMonitoringPage = () => (
  <WithProviders>
    <Pages.ReadShippingMonitoringPage />
  </WithProviders>
);

export const ReadStockpileMasterPage = () => (
  <WithProviders>
    <Pages.ReadStockpileMasterPage />
  </WithProviders>
);

export const ReadStockpileMonitoringPage = () => (
  <WithProviders>
    <Pages.ReadStockpileMonitoringPage />
  </WithProviders>
);

export const ReadWeatherProductionPage = () => (
  <WithProviders>
    <Pages.ReadWeatherProductionPage />
  </WithProviders>
);

export const ReadWorkingHoursPlanMasterPage = () => (
  <WithProviders>
    <Pages.ReadWorkingHoursPlanMasterPage />
  </WithProviders>
);

export const SampleHouseLabPage = () => (
  <WithProviders>
    <Pages.SampleHouseLabPage />
  </WithProviders>
);

export const ShiftMasterPage = () => (
  <WithProviders>
    <Pages.ShiftMasterPage />
  </WithProviders>
);

export const ShippingMonitoringPage = () => (
  <WithProviders>
    <Pages.ShippingMonitoringPage />
  </WithProviders>
);

export const StockpileMasterPage = () => (
  <WithProviders>
    <Pages.StockpileMasterPage />
  </WithProviders>
);

export const StockpilePage = () => (
  <WithProviders>
    <Pages.StockpilePage />
  </WithProviders>
);

export const UpdateActivityPlanMasterPage = () => (
  <WithProviders>
    <Pages.UpdateActivityPlanMasterPage />
  </WithProviders>
);

export const UpdateBlockMasterPage = () => (
  <WithProviders>
    <Pages.UpdateBlockMasterPage />
  </WithProviders>
);

export const UpdateBlockPitMasterPage = () => (
  <WithProviders>
    <Pages.UpdateBlockPitMasterPage />
  </WithProviders>
);

export const UpdateCalculationCategoryPage = () => (
  <WithProviders>
    <Pages.UpdateCalculationCategoryPage />
  </WithProviders>
);

export const UpdateCompanyHeavyEquipmentPage = () => (
  <WithProviders>
    <Pages.UpdateCompanyHeavyEquipmentPage />
  </WithProviders>
);

export const UpdateCompanyHumanResourcesPage = () => (
  <WithProviders>
    <Pages.UpdateCompanyHumanResourcesPage />
  </WithProviders>
);

export const UpdateCompanyPage = () => (
  <WithProviders>
    <Pages.UpdateCompanyPage />
  </WithProviders>
);

export const UpdateElementMasterPage = () => (
  <WithProviders>
    <Pages.UpdateElementMasterPage />
  </WithProviders>
);

export const UpdateFactoryMasterPage = () => (
  <WithProviders>
    <Pages.UpdateFactoryMasterPage />
  </WithProviders>
);

export const UpdateFrontProductionPage = () => (
  <WithProviders>
    <Pages.UpdateFrontProductionPage />
  </WithProviders>
);

export const UpdateHeavyEquipmentClassPage = () => (
  <WithProviders>
    <Pages.UpdateHeavyEquipmentClassPage />
  </WithProviders>
);

export const UpdateHeavyEquipmentFormulaPage = () => (
  <WithProviders>
    <Pages.UpdateHeavyEquipmentFormulaPage />
  </WithProviders>
);

export const UpdateHeavyEquipmentMasterPage = () => (
  <WithProviders>
    <Pages.UpdateHeavyEquipmentMasterPage />
  </WithProviders>
);

export const UpdateHeavyEquipmentPage = () => (
  <WithProviders>
    <Pages.UpdateHeavyEquipmentPage />
  </WithProviders>
);

export const UpdateHeavyEquipmentProductionPage = () => (
  <WithProviders>
    <Pages.UpdateHeavyEquipmentProductionPage />
  </WithProviders>
);

export const UpdateHumanResourcesPage = () => (
  <WithProviders>
    <Pages.UpdateHumanResourcesPage />
  </WithProviders>
);

export const UpdateLocationMasterPage = () => (
  <WithProviders>
    <Pages.UpdateLocationMasterPage />
  </WithProviders>
);

export const UpdateLoseTimeActivityPage = () => (
  <WithProviders>
    <Pages.UpdateLoseTimeActivityPage />
  </WithProviders>
);

export const UpdateMaterialMasterPage = () => (
  <WithProviders>
    <Pages.UpdateMaterialMasterPage />
  </WithProviders>
);

export const UpdateRitageBargingPage = () => (
  <WithProviders>
    <Pages.UpdateRitageBargingPage />
  </WithProviders>
);

export const UpdateRitageMovingPage = () => (
  <WithProviders>
    <Pages.UpdateRitageMovingPage />
  </WithProviders>
);

export const UpdateRitageObPage = () => (
  <WithProviders>
    <Pages.UpdateRitageObPage />
  </WithProviders>
);

export const UpdateRitageOrePage = () => (
  <WithProviders>
    <Pages.UpdateRitageOrePage />
  </WithProviders>
);

export const UpdateRitageQuarryPage = () => (
  <WithProviders>
    <Pages.UpdateRitageQuarryPage />
  </WithProviders>
);

export const UpdateRitageTopsoilPage = () => (
  <WithProviders>
    <Pages.UpdateRitageTopsoilPage />
  </WithProviders>
);

export const UpdateSampleHouseLabPage = () => (
  <WithProviders>
    <Pages.UpdateSampleHouseLabPage />
  </WithProviders>
);

export const UpdateShiftMasterPage = () => (
  <WithProviders>
    <Pages.UpdateShiftMasterPage />
  </WithProviders>
);

export const UpdateShippingMonitoringPage = () => (
  <WithProviders>
    <Pages.UpdateShippingMonitoringPage />
  </WithProviders>
);

export const UpdateStockpileDomeMasterPage = () => (
  <WithProviders>
    <Pages.UpdateStockpileDomeMasterPage />
  </WithProviders>
);

export const UpdateStockpileMasterPage = () => (
  <WithProviders>
    <Pages.UpdateStockpileMasterPage />
  </WithProviders>
);

export const UpdateStockpileMonitoringPage = () => (
  <WithProviders>
    <Pages.UpdateStockpileMonitoringPage />
  </WithProviders>
);

export const UpdateWeatherProductionPage = () => (
  <WithProviders>
    <Pages.UpdateWeatherProductionPage />
  </WithProviders>
);

export const UpdateWorkingHoursPlanMasterPage = () => (
  <WithProviders>
    <Pages.UpdateWorkingHoursPlanMasterPage />
  </WithProviders>
);

export const UploadHeavyEquipmentProductionPage = () => (
  <WithProviders>
    <Pages.UploadHeavyEquipmentProductionPage />
  </WithProviders>
);

export const UploadRitageBargingPage = () => (
  <WithProviders>
    <Pages.UploadRitageBargingPage />
  </WithProviders>
);

export const UploadRitageMovingPage = () => (
  <WithProviders>
    <Pages.UploadRitageMovingPage />
  </WithProviders>
);

export const UploadRitageObPage = () => (
  <WithProviders>
    <Pages.UploadRitageObPage />
  </WithProviders>
);

export const UploadRitageOrePage = () => (
  <WithProviders>
    <Pages.UploadRitageOrePage />
  </WithProviders>
);

export const UploadRitageQuarryPage = () => (
  <WithProviders>
    <Pages.UploadRitageQuarryPage />
  </WithProviders>
);

export const UploadRitageTopsoilPage = () => (
  <WithProviders>
    <Pages.UploadRitageTopsoilPage />
  </WithProviders>
);

export const WeatherProductionPage = () => (
  <WithProviders>
    <Pages.WeatherProductionPage />
  </WithProviders>
);

export const WorkingHoursPlanMasterPage = () => (
  <WithProviders>
    <Pages.WorkingHoursPlanMasterPage />
  </WithProviders>
);

export const MapProductionPage = () => (
  <WithProviders>
    <Pages.MapProductionPage />
  </WithProviders>
);

export const CreateMapWeeklyProductionPage = () => (
  <WithProviders>
    <Pages.CreateMapWeeklyProductionPage />
  </WithProviders>
);

export const CreateMapMonthlyProductionPage = () => (
  <WithProviders>
    <Pages.CreateMapMonthlyProductionPage />
  </WithProviders>
);

export const CreateMapQuarterlyProductionPage = () => (
  <WithProviders>
    <Pages.CreateMapQuarterlyProductionPage />
  </WithProviders>
);

export const CreateMapYearlyProductionPage = () => (
  <WithProviders>
    <Pages.CreateMapYearlyProductionPage />
  </WithProviders>
);

export const ReadMapWeeklyProductionPage = () => (
  <WithProviders>
    <Pages.ReadMapWeeklyProductionPage />
  </WithProviders>
);

export const ReadMapMonthlyProductionPage = () => (
  <WithProviders>
    <Pages.ReadMapMonthlyProductionPage />
  </WithProviders>
);

export const ReadMapQuarterlyProductionPage = () => (
  <WithProviders>
    <Pages.ReadMapQuarterlyProductionPage />
  </WithProviders>
);

export const ReadMapYearlyProductionPage = () => (
  <WithProviders>
    <Pages.ReadMapYearlyProductionPage />
  </WithProviders>
);

export const UpdateMapWeeklyProductionPage = () => (
  <WithProviders>
    <Pages.UpdateMapWeeklyProductionPage />
  </WithProviders>
);

export const UpdateMapMonthlyProductionPage = () => (
  <WithProviders>
    <Pages.UpdateMapMonthlyProductionPage />
  </WithProviders>
);

export const UpdateMapQuarterlyProductionPage = () => (
  <WithProviders>
    <Pages.UpdateMapQuarterlyProductionPage />
  </WithProviders>
);

export const UpdateMapYearlyProductionPage = () => (
  <WithProviders>
    <Pages.UpdateMapYearlyProductionPage />
  </WithProviders>
);
