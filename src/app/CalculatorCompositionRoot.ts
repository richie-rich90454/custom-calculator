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
import { MathJsCalculationErrorMapper } from "../infrastructure/mathjs/MathJsCalculationErrorMapper";
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
import { DefaultCasBlockParser } from "../application/cas/DefaultCasBlockParser";
import { DefaultCasExpressionRouterService } from "../application/cas/DefaultCasExpressionRouterService";
import { DefaultCasOperationCatalogService } from "../application/cas/DefaultCasOperationCatalogService";
import type { CasOperationCatalogService } from "../application/cas/CasOperationCatalogService";
import { DefaultCalculusBlockParser } from "../application/calculus/DefaultCalculusBlockParser";
import { DefaultCalculusAngleModePolicyService } from "../application/calculus/DefaultCalculusAngleModePolicyService";
import { DefaultCalculusExpressionRouterService } from "../application/calculus/DefaultCalculusExpressionRouterService";
import { DefaultFiniteProductService } from "../application/calculus/DefaultFiniteProductService";
import { DefaultFiniteSummationService } from "../application/calculus/DefaultFiniteSummationService";
import { DefaultLimitEstimationService } from "../application/calculus/DefaultLimitEstimationService";
import { DefaultNumericDifferentiationService } from "../application/calculus/DefaultNumericDifferentiationService";
import { DefaultNumericIntegrationService } from "../application/calculus/DefaultNumericIntegrationService";
import type { CalculusExpressionRouterService } from "../application/calculus/CalculusExpressionRouterService";
import { DefaultCalculusOperationCatalogService } from "../application/calculus/DefaultCalculusOperationCatalogService";
import type { CalculusOperationCatalogService } from "../application/calculus/CalculusOperationCatalogService";
import { DefaultSymbolicDifferentiationService } from "../infrastructure/calculus/DefaultSymbolicDifferentiationService";
import { DefaultSymbolicIntegrationService } from "../infrastructure/calculus/DefaultSymbolicIntegrationService";
import { DefaultTaylorSeriesService } from "../infrastructure/calculus/DefaultTaylorSeriesService";
import { MathJsCalculusExpressionEvaluator } from "../infrastructure/calculus/MathJsCalculusExpressionEvaluator";

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
    public readonly casOperationCatalogService: CasOperationCatalogService;
    public readonly calculusExpressionRouterService: CalculusExpressionRouterService;
    public readonly calculusOperationCatalogService: CalculusOperationCatalogService;

    public constructor() {
        this.bigIntSupportDetector = new BrowserBigIntSupportDetector();
        this.browserFeatureDetectionService = new DefaultBrowserFeatureDetectionService(
            this.bigIntSupportDetector,
        );
        this.numericModePolicyService = new DefaultNumericModePolicyService(
            this.bigIntSupportDetector,
        );
        this.scientificConstantRepository = new StaticScientificConstantRepository();
        this.constantCatalogService = new DefaultConstantCatalogService(
            this.scientificConstantRepository,
        );
        this.functionCatalogService = new DefaultScientificFunctionCatalogService();
        this.expressionEditingService = new DefaultExpressionEditingService(
            this.functionCatalogService,
        );
        this.expressionValidationService = new DefaultExpressionValidationService(
            this.functionCatalogService,
            this.constantCatalogService,
        );
        this.resultFormattingService = new DefaultResultFormattingService();
        this.angleConversionService = new DefaultAngleConversionService();
        this.mathJsInstanceProvider = new DefaultMathJsInstanceProvider();
        this.expressionEvaluationGateway = new MathJsExpressionEvaluationGateway(
            this.mathJsInstanceProvider,
            new MathJsConstantScopeBuilder(
                this.constantCatalogService,
                new DefaultMathJsFractionValueFactory(),
            ),
            new MathJsFunctionWhitelist(this.functionCatalogService.getFunctionNames()),
            this.resultFormattingService,
            new MathJsCalculationErrorMapper(),
        );
        this.casService = new MathJsCasService(
            this.mathJsInstanceProvider,
            this.resultFormattingService,
        );
        this.casOperationCatalogService = new DefaultCasOperationCatalogService();
        this.calculusOperationCatalogService = new DefaultCalculusOperationCatalogService();
        const casBlockParser = new DefaultCasBlockParser();
        const casExpressionRouterService = new DefaultCasExpressionRouterService();
        this.settingsRepository = new LocalStorageSettingsRepository();

        const calculusExpressionEvaluator = new MathJsCalculusExpressionEvaluator(
            this.mathJsInstanceProvider,
        );
        const calculusAngleModePolicyService = new DefaultCalculusAngleModePolicyService();
        const symbolicDifferentiationService = new DefaultSymbolicDifferentiationService(
            this.mathJsInstanceProvider,
            calculusAngleModePolicyService,
            this.resultFormattingService,
        );
        const symbolicIntegrationService = new DefaultSymbolicIntegrationService(
            this.mathJsInstanceProvider,
            this.resultFormattingService,
        );
        const taylorSeriesService = new DefaultTaylorSeriesService(
            this.mathJsInstanceProvider,
            symbolicDifferentiationService,
            calculusExpressionEvaluator,
            this.resultFormattingService,
        );
        const calculusBlockParser = new DefaultCalculusBlockParser();
        this.calculusExpressionRouterService = new DefaultCalculusExpressionRouterService(
            new DefaultNumericDifferentiationService(calculusExpressionEvaluator),
            new DefaultNumericIntegrationService(calculusExpressionEvaluator),
            new DefaultLimitEstimationService(calculusExpressionEvaluator),
            new DefaultFiniteSummationService(calculusExpressionEvaluator),
            new DefaultFiniteProductService(calculusExpressionEvaluator),
            symbolicDifferentiationService,
            symbolicIntegrationService,
            taylorSeriesService,
            calculusAngleModePolicyService,
            this.resultFormattingService,
        );

        const persistence = this.createPersistenceRepositories();

        this.historyRepository = persistence.historyRepository;
        this.variablesRepository = persistence.variablesRepository;

        this.orchestrationService = new DefaultCalculatorSessionOrchestrationService(
            this.historyRepository,
            this.variablesRepository,
            this.settingsRepository,
        );
        this.calculatorApplicationController = new DefaultCalculatorApplicationController(
            this.expressionEditingService,
            this.expressionValidationService,
            this.expressionEvaluationGateway,
            this.numericModePolicyService,
            this.functionCatalogService,
            this.constantCatalogService,
            this.casService,
            casBlockParser,
            casExpressionRouterService,
            calculusBlockParser,
            this.calculusExpressionRouterService,
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
