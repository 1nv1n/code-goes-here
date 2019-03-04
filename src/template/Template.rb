class CodeGoesHere
  def initialize(str)
     @str = str.capitalize
  end
  def greet
     puts "#{@str}!"
  end
end

solution = CodeGoesHere.new("Hello from Monaco")
solution.greet