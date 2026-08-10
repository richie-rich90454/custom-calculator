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
import { NewtonRaphsonEquationSolvingGateway } from "../infrastructure/mathjs/NewtonRaphsonEquationSolvingGateway";
import { MathJsResultFormatGateway } from "../infrastructure/mathjs/MathJsResultFormatGateway";
import { MathJsComplexOperationsGateway } from "../infrastructure/mathjs/MathJsComplexOperationsGateway";
import { MathJsMatrixOperationsGateway } from "../infrastructure/mathjs/MathJsMatrixOperationsGateway";
import { MathJsVectorOperationsGateway } from "../infrastructure/mathjs/MathJsVectorOperationsGateway";
import type { ComplexOperationsGateway } from "../domain/services/ComplexOperationsGateway";
import type { MatrixOperationsGateway } from "../domain/services/MatrixOperationsGateway";
import type { VectorOperationsGateway } from "../domain/services/VectorOperationsGateway";
import type { BigIntBaseNArithmeticService } from "../application/services/BigIntBaseNArithmeticService";
import { DefaultBigIntBaseNArithmeticService } from "../application/services/DefaultBigIntBaseNArithmeticService";
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
import type { EquationSolvingService } from "../application/services/EquationSolvingService";
import { DefaultEquationSolvingService } from "../application/services/DefaultEquationSolvingService";
import type { ResultFormatService } from "../domain/services/ResultFormatService";
import { DefaultResultFormatService } from "../domain/services/ResultFormatService";
import type { ModifierLayerService } from "../presentation/services/ModifierLayerService";
import { DefaultModifierLayerService } from "../presentation/services/DefaultModifierLayerService";
import type { KeymapDefinitionService } from "../presentation/services/KeymapDefinitionService";
import { DefaultKeymapDefinitionService } from "../presentation/services/DefaultKeymapDefinitionService";
import type { KeyActionDispatcherService } from "../presentation/services/KeyActionDispatcherService";
import { DefaultKeyActionDispatcherService } from "../presentation/services/DefaultKeyActionDispatcherService";
import type { AppModeRegistryService } from "../presentation/services/AppModeRegistryService";
import { DefaultAppModeRegistryService } from "../presentation/services/DefaultAppModeRegistryService";
import type { PhysicalKeyboardBindingService as PhysicalKeyboardBindingServiceContract } from "../presentation/services/PhysicalKeyboardBindingService";
import { PhysicalKeyboardBindingService } from "../presentation/services/PhysicalKeyboardBindingService";
import type { ExpressionVariablePromptService } from "../presentation/services/ExpressionVariablePromptService";
import { DefaultExpressionVariablePromptService } from "../presentation/services/DefaultExpressionVariablePromptService";
import type { ReplayHistoryService } from "../presentation/services/ReplayHistoryService";
import { DefaultReplayHistoryService } from "../presentation/services/DefaultReplayHistoryService";
import type { StatisticsSummaryService } from "../application/services/StatisticsSummaryService";
import { DefaultStatisticsSummaryService } from "../application/services/DefaultStatisticsSummaryService";
import type { RegressionAnalysisService } from "../application/services/RegressionAnalysisService";
import { DefaultRegressionAnalysisService } from "../application/services/DefaultRegressionAnalysisService";
import type { TableGenerationService } from "../application/services/TableGenerationService";
import { DefaultTableGenerationService } from "../application/services/DefaultTableGenerationService";
import type { PolynomialRootService } from "../application/services/PolynomialRootService";
import { AnalyticPolynomialRootService } from "../application/services/AnalyticPolynomialRootService";
import type { SimultaneousEquationService } from "../application/services/SimultaneousEquationService";
import { GaussianEliminationSimultaneousEquationService } from "../application/services/GaussianEliminationSimultaneousEquationService";
import type { RatioSolverService } from "../application/services/RatioSolverService";
import { DefaultRatioSolverService } from "../application/services/DefaultRatioSolverService";

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
    public readonly resultFormatService: ResultFormatService;
    public readonly equationSolvingService: EquationSolvingService;
    public readonly modifierLayerService: ModifierLayerService;
    public readonly keymapDefinitionService: KeymapDefinitionService;
    public readonly keyActionDispatcherService: KeyActionDispatcherService;
    public readonly appModeRegistryService: AppModeRegistryService;
    public readonly physicalKeyboardBindingService: PhysicalKeyboardBindingServiceContract;
    public readonly expressionVariablePromptService: ExpressionVariablePromptService;
    public readonly replayHistoryService: ReplayHistoryService;
    public readonly complexOperationsGateway: ComplexOperationsGateway;
    public readonly bigIntBaseNArithmeticService: BigIntBaseNArithmeticService;
    public readonly matrixOperationsGateway: MatrixOperationsGateway;
    public readonly vectorOperationsGateway: VectorOperationsGateway;
    public readonly statisticsSummaryService: StatisticsSummaryService;
    public readonly regressionAnalysisService: RegressionAnalysisService;
    public readonly tableGenerationService: TableGenerationService;
    public readonly polynomialRootService: PolynomialRootService;
    public readonly simultaneousEquationService: SimultaneousEquationService;
    public readonly ratioSolverService: RatioSolverService;

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
        this.resultFormatService = new DefaultResultFormatService(
            new MathJsResultFormatGateway(this.mathJsInstanceProvider),
        );
        this.equationSolvingService = new DefaultEquationSolvingService(
            new NewtonRaphsonEquationSolvingGateway(this.mathJsInstanceProvider),
        );
        this.modifierLayerService = new DefaultModifierLayerService();
        this.keymapDefinitionService = new DefaultKeymapDefinitionService();
        this.keyActionDispatcherService = new DefaultKeyActionDispatcherService();
        this.appModeRegistryService = new DefaultAppModeRegistryService();
        this.physicalKeyboardBindingService = new PhysicalKeyboardBindingService();
        this.expressionVariablePromptService = new DefaultExpressionVariablePromptService(
            this.functionCatalogService,
            this.constantCatalogService,
        );
        this.replayHistoryService = new DefaultReplayHistoryService();
        this.complexOperationsGateway = new MathJsComplexOperationsGateway(
            this.mathJsInstanceProvider,
        );
        this.bigIntBaseNArithmeticService = new DefaultBigIntBaseNArithmeticService();
        this.matrixOperationsGateway = new MathJsMatrixOperationsGateway(
            this.mathJsInstanceProvider,
        );
        this.vectorOperationsGateway = new MathJsVectorOperationsGateway(
            this.mathJsInstanceProvider,
        );
        this.statisticsSummaryService = new DefaultStatisticsSummaryService();
        this.regressionAnalysisService = new DefaultRegressionAnalysisService();
        this.tableGenerationService = new DefaultTableGenerationService(
            new NewtonRaphsonEquationSolvingGateway(this.mathJsInstanceProvider),
        );
        this.polynomialRootService = new AnalyticPolynomialRootService();
        this.simultaneousEquationService = new GaussianEliminationSimultaneousEquationService();
        this.ratioSolverService = new DefaultRatioSolverService();
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
