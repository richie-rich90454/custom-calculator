import type { AngleConversionService } from "../domain/services/AngleConversionService";
import type { CasService } from "../domain/services/CasService";
import type { ConstantCatalogService } from "../domain/services/ConstantCatalogService";
import type { ExpressionEditingService } from "../domain/services/ExpressionEditingService";
import type { ExpressionEvaluationGateway } from "../domain/services/ExpressionEvaluationGateway";
import type { ExpressionValidationService } from "../domain/services/ExpressionValidationService";
import type { NumericModePolicyService } from "../domain/services/NumericModePolicyService";
import type { ResultFormattingService } from "../domain/services/ResultFormattingService";
import type { ScientificFunctionCatalogService } from "../domain/services/ScientificFunctionCatalogService";
import type { HistoryRepository } from "../domain/repositories/HistoryRepository";
import type { ScientificConstantRepository } from "../domain/repositories/ScientificConstantRepository";
import type { SettingsRepository } from "../domain/repositories/SettingsRepository";
import type { VariablesRepository } from "../domain/repositories/VariablesRepository";
import { DefaultAngleConversionService } from "../domain/services/DefaultAngleConversionService";
import { MathJsCasService } from "../infrastructure/mathjs/MathJsCasService";
import { DefaultConstantCatalogService } from "../domain/services/DefaultConstantCatalogService";
import { DefaultExpressionEditingService } from "../domain/services/DefaultExpressionEditingService";
import { DefaultExpressionValidationService } from "../domain/services/DefaultExpressionValidationService";
import { DefaultNumericModePolicyService } from "../domain/services/DefaultNumericModePolicyService";
import { DefaultResultFormattingService } from "../domain/services/DefaultResultFormattingService";
import { DefaultScientificFunctionCatalogService } from "../domain/services/DefaultScientificFunctionCatalogService";
import { BrowserBigIntSupportDetector } from "../infrastructure/featuredetection/BrowserBigIntSupportDetector";
import { DefaultBrowserFeatureDetectionService } from "../infrastructure/featuredetection/DefaultBrowserFeatureDetectionService";
import type { BigIntSupportDetector } from "../infrastructure/featuredetection/BigIntSupportDetector";
import type { BrowserFeatureDetectionService } from "../infrastructure/featuredetection/BrowserFeatureDetectionService";
import { DefaultMathJsInstanceProvider } from "../infrastructure/mathjs/DefaultMathJsInstanceProvider";
import type { MathJsInstanceProvider } from "../infrastructure/mathjs/MathJsInstanceProvider";
import { MathJsConstantScopeBuilder } from "../infrastructure/mathjs/MathJsConstantScopeBuilder";
import { DefaultMathJsFractionValueFactory } from "../infrastructure/mathjs/MathJsFractionValueFactory";
import { MathJsExpressionEvaluationGateway } from "../infrastructure/mathjs/MathJsExpressionEvaluationGateway";
import { MathJsFunctionWhitelist } from "../infrastructure/mathjs/MathJsFunctionWhitelist";
import { CalculatorDexieDatabase } from "../infrastructure/persistence/CalculatorDexieDatabase";
import { IndexedDbHistoryRepository } from "../infrastructure/persistence/IndexedDbHistoryRepository";
import { IndexedDbVariablesRepository } from "../infrastructure/persistence/IndexedDbVariablesRepository";
import { InMemoryHistoryRepository } from "../infrastructure/persistence/InMemoryHistoryRepository";
import { InMemoryVariablesRepository } from "../infrastructure/persistence/InMemoryVariablesRepository";
import { LocalStorageSettingsRepository } from "../infrastructure/persistence/LocalStorageSettingsRepository";
import { StaticScientificConstantRepository } from "../infrastructure/constants/StaticScientificConstantRepository";
import { DefaultCalculatorSessionOrchestrationService } from "../application/services/DefaultCalculatorSessionOrchestrationService";
import type { CalculatorSessionOrchestrationService } from "../application/services/CalculatorSessionOrchestrationService";
import { DefaultUniqueIdentifierFactory } from "../application/services/DefaultUniqueIdentifierFactory";
import type { UniqueIdentifierFactory } from "../application/services/UniqueIdentifierFactory";
import { DefaultCalculatorApplicationController } from "../application/controllers/DefaultCalculatorApplicationController";
import type { CalculatorApplicationController } from "../application/controllers/CalculatorApplicationController";

const DATABASE_NAME = "custom-calculator";

export class CalculatorCompositionRoot {
  public readonly bigIntSupportDetector: BigIntSupportDetector;
  public readonly browserFeatureDetectionService: BrowserFeatureDetectionService;
  public readonly numericModePolicyService: NumericModePolicyService;
  public readonly scientificConstantRepository: ScientificConstantRepository;
  public readonly constantCatalogService: ConstantCatalogService;
  public readonly functionCatalogService: ScientificFunctionCatalogService;
  public readonly expressionEditingService: ExpressionEditingService;
  public readonly expressionValidationService: ExpressionValidationService;
  public readonly resultFormattingService: ResultFormattingService;
  public readonly angleConversionService: AngleConversionService;
  public readonly mathJsInstanceProvider: MathJsInstanceProvider;
  public readonly expressionEvaluationGateway: ExpressionEvaluationGateway;
  public readonly casService: CasService;
  public readonly settingsRepository: SettingsRepository;
  public readonly historyRepository: HistoryRepository;
  public readonly variablesRepository: VariablesRepository;
  public readonly orchestrationService: CalculatorSessionOrchestrationService;
  public readonly calculatorApplicationController: CalculatorApplicationController;
  public readonly uniqueIdentifierFactory: UniqueIdentifierFactory;

  public constructor() {
    this.bigIntSupportDetector = new BrowserBigIntSupportDetector();
    this.browserFeatureDetectionService = new DefaultBrowserFeatureDetectionService(
      this.bigIntSupportDetector
    );
    this.numericModePolicyService = new DefaultNumericModePolicyService(
      this.bigIntSupportDetector
    );
    this.scientificConstantRepository = new StaticScientificConstantRepository();
    this.constantCatalogService = new DefaultConstantCatalogService(
      this.scientificConstantRepository
    );
    this.functionCatalogService = new DefaultScientificFunctionCatalogService();
    this.expressionEditingService = new DefaultExpressionEditingService(
      this.functionCatalogService
    );
    this.expressionValidationService = new DefaultExpressionValidationService(
      this.functionCatalogService,
      this.constantCatalogService
    );
    this.resultFormattingService = new DefaultResultFormattingService();
    this.angleConversionService = new DefaultAngleConversionService();
    this.mathJsInstanceProvider = new DefaultMathJsInstanceProvider();
    this.expressionEvaluationGateway = new MathJsExpressionEvaluationGateway(
      this.mathJsInstanceProvider,
      new MathJsConstantScopeBuilder(
        this.constantCatalogService,
        new DefaultMathJsFractionValueFactory()
      ),
      new MathJsFunctionWhitelist(
        this.functionCatalogService.getFunctionNames()
      ),
      this.resultFormattingService
    );
    this.casService = new MathJsCasService(
      this.mathJsInstanceProvider,
      this.resultFormattingService
    );
    this.settingsRepository = new LocalStorageSettingsRepository();

    const persistence = this.createPersistenceRepositories();

    this.historyRepository = persistence.historyRepository;
    this.variablesRepository = persistence.variablesRepository;

    this.orchestrationService = new DefaultCalculatorSessionOrchestrationService(
      this.historyRepository,
      this.variablesRepository,
      this.settingsRepository
    );
    this.calculatorApplicationController =
      new DefaultCalculatorApplicationController(
        this.expressionEditingService,
        this.expressionValidationService,
        this.expressionEvaluationGateway,
        this.numericModePolicyService,
        this.functionCatalogService,
        this.constantCatalogService,
        this.casService
      );
    this.uniqueIdentifierFactory = new DefaultUniqueIdentifierFactory();
  }

  private createPersistenceRepositories(): {
    readonly historyRepository: HistoryRepository;
    readonly variablesRepository: VariablesRepository;
  } {
    if (typeof globalThis.indexedDB === "undefined") {
      return {
        historyRepository: new InMemoryHistoryRepository(),
        variablesRepository: new InMemoryVariablesRepository(),
      };
    }

    try {
      const database = new CalculatorDexieDatabase(DATABASE_NAME);

      return {
        historyRepository: new IndexedDbHistoryRepository(database),
        variablesRepository: new IndexedDbVariablesRepository(database),
      };
    } catch {
      return {
        historyRepository: new InMemoryHistoryRepository(),
        variablesRepository: new InMemoryVariablesRepository(),
      };
    }
  }
}
