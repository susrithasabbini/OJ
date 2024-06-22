import { Snippet } from "@nextui-org/react";
import { Pane } from "split-pane-react";

const ProblemStatement = ({problem}) => {
    return ( 
        <Pane maxSize="50%">
          <div className="p-6 border-r-3 shadow-lg h-full overflow-y-scroll thin-scrollbar">
            <h1 className="text-2xl font-semibold mb-4 text-gray-700">
              {problem.title}
            </h1>
            <p className="text-medium mb-4">{problem.description}</p>
            <h2 className="text-xl font-semibold mb-2">Examples</h2>
            {problem.examples.map((example, index) => (
              <div key={index} className="mb-4">
                <p>
                  <strong className="text-gray-800">Input:</strong>{" "}
                  {example.input}
                </p>
                <p>
                  <strong>Output:</strong> {example.output}
                </p>
              </div>
            ))}
            <div className="flex flex-col gap-y-3 justify-center">
              {problem.input.map((inp, i) => (
                <div key={i}>
                  <h2 className="text-gray-800 text-sm my-2">Input {i + 1}</h2>
                  <Snippet symbol="">
                    <span>{inp}</span>
                  </Snippet>
                </div>
              ))}
            </div>

            <h2 className="text-xl font-semibold mt-2">Constraints</h2>
            <p>{problem.constraints}</p>
          </div>
        </Pane>
     );
}
 
export default ProblemStatement;