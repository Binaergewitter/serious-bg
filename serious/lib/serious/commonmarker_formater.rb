require 'stupid_formatter'
require 'commonmarker'

class StupidFormatter::CommonMarker < StupidFormatter::AbstractFormatter
  def result
    Commonmarker.to_html(input)
  end
end
